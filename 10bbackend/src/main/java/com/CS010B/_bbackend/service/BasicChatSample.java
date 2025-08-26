package com.CS010B._bbackend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.CS010B._bbackend.model.ChatMessage;

@Service
public final class BasicChatSample 
{
    private final AzureOpenAiChatModel chatModel;
    
    //Temp for now but change this to using firebase
    private Map<String,List<ChatMessage>> chatHistory = new HashMap<>();

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

        System.out.println(res);
        return res;
    }

    public String getChat(String userPrompt, String problem, String netId)
    {
        StringBuilder sys = new StringBuilder();
        sys.append("You're an assistant helping students learn C++ programming on their own without using AI ");
        sys.append("for an introductory C++ college level course. ");
        sys.append("Provide helpful guidance but don't write complete solutions. ");
        sys.append("Suggest approaches, explain concepts, and guide students through debugging.");

        try
        {
            Map<String,Object> details = firestore.getProblem(problem);
            if(details != null)
            {
                String desc = (String)details.get("Description");
                String difficulty = String.valueOf(details.get("Difficulty"));
                String problemTitle = (String) details.get("Problem");
                
                sys.append("\nThe student is working on this problem: \n");
                sys.append("Title: ").append(problemTitle).append("\n");
                sys.append("Difficulty: ").append(difficulty).append("\n");
                sys.append("Description: ").append(desc).append("\n");
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
            firestore.logMessage(netId, problem, netId, response);
        }
        catch(Exception e)
        {
            System.err.println("Could not store chats: " + e.getMessage());
        }

        return response;
    }

    public List<ChatMessage> getHistory(String problem, String netId)
    {
        String key = netId + "-" + problem;
        return chatHistory.getOrDefault(key,new ArrayList<>());
    }

}