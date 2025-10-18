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


    public String getChat(String topic, String difficulty, String problem, String userPrompt, String netId) throws Exception
    {
        Map<String,Object> details = firestore.getProblem(topic,difficulty,problem);
        String problemDesc = (String)details.get("Description");
        StringBuilder sys = new StringBuilder();
        sys.append("You are a helpful C++ programming tutor for introductory college students.");
        sys.append("Take a look at this problem " + problemDesc + "and provide helpful guidance but don't write complete solutions.");
        
        boolean isAutomatedFeedback = userPrompt.startsWith("AUTOMATED_FEEDBACK:");
    
        if (isAutomatedFeedback) 
        {
            userPrompt = userPrompt.replace("AUTOMATED_FEEDBACK: ", "");
            
            sys.append("\n\nProvide feedback in this exact format:\n\n");
            sys.append("## What You Did Well\n");
            sys.append("[List 2-3 specific positive aspects of their code]\n\n");
            sys.append("## Areas for Improvement\n");
            sys.append("[Identify 2-3 specific issues or misconceptions]\n\n");
            sys.append("## Specific Suggestions\n");
            sys.append("[Provide concrete, actionable improvements with brief code examples]\n\n");
            sys.append("## Learning Resources\n");
            sys.append("[Suggest 1-2 specific topics to study based on their code]\n\n");
            sys.append("Keep explanations beginner-friendly, use simple language, and focus on learning rather than just fixing. ");
        } else {
            sys.append("\n\nAnswer the student's question conversationally and helpfully. ");
            sys.append("Provide hints and explanations, but don't write complete solutions. ");
            sys.append("Guide them to discover the answer themselves. ");
        }
    
        sys.append("Don't provide complete solutions - guide them to discover the answer. ");
        sys.append("If their code has syntax errors, explain the concept behind the fix rather than just the correction.\n\n");
        try
        {
                sys.append("\nThe student is working on this problem: \n");
                sys.append("Title: ").append(problem).append("\n");
                sys.append("Difficulty: ").append(difficulty).append("\n");
                sys.append("Description: ").append(problemDesc).append("\n");

                if(userPrompt.equals(" "))
                {
                    if(!details.containsKey("Solution") || !details.containsKey("Testcases"))
                    {
                        String solutionPrompt = "Write a correct C++ solution for the following problem. Only output code, no explanation.\nProblem: " + problemDesc;
                        Prompt pr = new Prompt(List.of(new SystemMessage(solutionPrompt)));
                        String solCode = chatModel.call(pr).getResult().getOutput().getText();

                        List<Map<String,String>> testCases = createTests(problemDesc, solCode);
                        if(testCases != null && !testCases.isEmpty() && solCode != null && !solCode.isEmpty())
                        {
                            firestore.storeTests(topic,difficulty,problem, solCode, testCases);
                        }
                    }

                    return " ";

                }

            Map<String,Object> studentDetails = firestore.getStudentProblem(topic, difficulty, problem,netId);
            if(studentDetails != null)
            {
                int attempts = ((Number) studentDetails.getOrDefault("# of Attempts", 0)).intValue();
                String latestCode = (String) studentDetails.get("Latest Code");
                
                sys.append("\nStudent Progress: \n");
                sys.append("Attempts so far: ").append(attempts).append("\n");
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
            firestore.logMessage(topic,difficulty,problem,userPrompt,response,netId);
        }
        catch(Exception e)
        {
            System.err.println("Could not store chats: " + e.getMessage());
        }

        return response;
    }

    public List<ChatMessage> getHistory(String topic, String difficulty, String problem, String netId)
    {
        try 
        {
            return firestore.loadChats(topic, difficulty,problem, netId);
        } 
        catch (ExecutionException | InterruptedException e) 
        {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Map<String,String>> createTests(String problem, String code)
    {
        String prompt = "You are an autograder for C++. For the following problem, generate 7 unique unit test cases. If not 7, generate as many unique cases as you can which includes testing edge cases " +
        "Each test case should have:\n" + //
                        "- input: the raw values that would be entered via cin (e.g., \"false false\")\n" + //
                        "- expectedOutput: the output value (e.g., \"true\")\n" + //
        "Format your response as a JSON array of objects with keys 'input', 'expectedOutput', 'userOutput'.\n" +
        "Problem: " + problem + "\nCode:\n" + code;

        Prompt promptTwo = new Prompt(List.of(new SystemMessage(prompt)));
        String res = chatModel.call(promptTwo).getResult().getOutput().getText();
        res = res.replaceAll("```json", "").replaceAll("```", "").trim();

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