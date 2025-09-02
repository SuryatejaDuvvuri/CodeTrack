package com.CS010B._bbackend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.CS010B._bbackend.model.ChatMessage;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
// import com.google.cloud.firestore.DocumentReference;

@Service
public final class BasicChatSample 
{
    private final AzureOpenAiChatModel chatModel;

    @Autowired
    private FirestoreService firestore;

    public BasicChatSample(AzureOpenAiChatModel chatModel)
    {
        this.chatModel = chatModel;
    }

    public String getResponse()
    {
        Prompt prompt = new Prompt(List.of(
                new SystemMessage("You're an assistant helping students learn C++ programming on their own without using AI for an introductory C++ college level course."),
                new UserMessage("What is an implicit and explicit parameter in simple terms?")
        ));
        String res = chatModel.call(prompt).getResult().getOutput().getText();
        return res;
    }

    public String getChat(String userPrompt, String problem, String netId)
    {
        StringBuilder sys = new StringBuilder();
        sys.append("You're an assistant helping students learn C++ programming on their own without using AI ");
        sys.append("for an introductory C++ college level course. Take a look at this problem " + problem + "and provide helpful guidance but don't write complete solutions.");
        sys.append("Suggest approaches, explain concepts, and guide students through debugging. Make it short and concise.");

        try
        {
            String diff = problem.startsWith("Easy") ? "easy" : problem.startsWith("Medium") ? "medium" : "hard";
            Map<String,Object> details = firestore.getProblem(diff,problem);
            System.out.println(details);
            if(details != null)
            {
                String desc = (String)details.get("Description");
                String difficulty = String.valueOf(details.get("Difficulty"));
                String problemTitle = (String) details.get("Problem");
                
                sys.append("\nThe student is working on this problem: \n");
                sys.append("Title: ").append(problemTitle).append("\n");
                sys.append("Difficulty: ").append(difficulty).append("\n");
                sys.append("Description: ").append(desc).append("\n");

                if(!details.containsKey("Solution") || !details.containsKey("Testcases"))
                {
                    String solutionPrompt = "Write a correct C++ solution for the following problem. Only output code, no explanation.\nProblem: " + desc;
                    Prompt pr = new Prompt(List.of(new SystemMessage(solutionPrompt)));
                    String solCode = chatModel.call(pr).getResult().getOutput().getText();

                    List<Map<String,String>> testCases = createTests(desc, solCode);
                    firestore.storeTests(problem, solCode, testCases);
                }
            }

            Map<String,Object> studentDetails = firestore.getStudentProblem(netId, problem);
            if(studentDetails != null)
            {
                int attempts = ((Number) studentDetails.getOrDefault("# of Attempts", 0)).intValue();
                Object timeSpent = studentDetails.get("Avg Time Spent");
                String latestCode = (String) studentDetails.get("Latest Code");
                
                sys.append("\nStudent Progress: \n");
                sys.append("Attempts so far: ").append(attempts).append("\n");
                if (timeSpent != null) 
                {
                    sys.append("Time spent: ").append(timeSpent).append(" minutes\n");
                }
                if (latestCode != null && !latestCode.isEmpty()) 
                {
                    sys.append("Latest code submission: \n```cpp\n").append(latestCode).append("\n```\n");
                }
            }
        }
        catch(Exception e)
        {
            System.err.println("Could not fetch content from Firestore: " + e.getMessage());
        }

        Prompt prompt = new Prompt(List.of(new SystemMessage(sys.toString()), new UserMessage(userPrompt)));
        String response = chatModel.call(prompt).getResult().getOutput().getText();
        
        try
        {
            firestore.logMessage(netId, problem, userPrompt, response);
        }
        catch(Exception e)
        {
            System.err.println("Could not store chats: " + e.getMessage());
        }

        return response;
    }

    public List<ChatMessage> getHistory(String problem, String netId)
    {
        try 
        {
            return firestore.loadChats(problem, netId);
        } 
        catch (ExecutionException | InterruptedException e) 
        {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Map<String,String>> createTests(String problem, String code)
    {
        String prompt = "You are an autograder for C++. For the following problem, generate 7 unit test cases. " +
        "Each test case should include: test case #, input, expected output, and user's output. " +
        "Format your response as a JSON array of objects with keys 'input', 'expectedOutput', 'userOutput'.\n" +
        "Problem: " + problem + "\nCode:\n" + code;

        Prompt promptTwo = new Prompt(List.of(new SystemMessage(prompt)));
        String res = chatModel.call(promptTwo).getResult().getOutput().getText();

        ObjectMapper map = new ObjectMapper();
        List<Map<String,String>> testCases = new ArrayList<>();

        try
        {
            testCases = map.readValue(res, new TypeReference<List<Map<String,String>>>() {});
        }
        catch(Exception e)
        {
            System.err.println("Could not parse JSON: " + e.getMessage());
        }

        return testCases;
    
    }

}