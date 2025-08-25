package com.CS010B._bbackend.service;

import java.util.List;

import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
public final class BasicChatSample 
{
    private final AzureOpenAiChatModel chatModel;

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

}