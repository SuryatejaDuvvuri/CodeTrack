package com.CS010B._bbackend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import com.CS010B._bbackend.model.ChatMessage;

@Service
public final class BasicChatSample 
{
    private final AzureOpenAiChatModel chatModel;
    
    //Temp for now but change this to using firebase
    private Map<String,List<ChatMessage>> chatHistory = new HashMap<>();

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
        String key = netId + "-" + problem;
        String sys = getSystemPrompt(problem);
        saveMessage(userPrompt,"user",problem,netId);

        Prompt prompt = new Prompt(List.of(new SystemMessage(sys), new UserMessage(userPrompt)));
        String response = chatModel.call(prompt).getResult().getOutput().getText();
        saveMessage(response,"system",problem,netId);

        return response;
    }

    public List<ChatMessage> getHistory(String problem, String netId)
    {
        String key = netId + "-" + problem;
        return chatHistory.getOrDefault(key,new ArrayList<>());
    }

    private String getSystemPrompt(String problem)
    {
        //Change this to fetch specific problem from firebase
        return "You're an assistant helping students learn C++ programming on their own without using AI for an introductory C++ college level course. " +
               "Provide helpful guidance but don't write complete solutions. " +
               "Suggest approaches, explain concepts, and guide students through debugging.";
    }

    private void saveMessage(String content, String role, String problem, String netId)
    {
        String key = netId + "-" + problem;

        ChatMessage msg = new ChatMessage();
        msg.setId(UUID.randomUUID().toString());
        msg.setContent(content);
        msg.setRole(role);
        msg.setTimestamp(LocalDateTime.now());
        msg.setProblem(problem);
        msg.setNetId(netId);

        List<ChatMessage> history = chatHistory.getOrDefault(key, new ArrayList<>());
        history.add(msg);
        chatHistory.put(key,history);
    }

}