package com.CS010B._bbackend.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.azure.openai.AzureOpenAiChatOptions;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.model.Generation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatRequestAssistantMessage;
import com.azure.ai.openai.models.ChatRequestMessage;
import com.azure.ai.openai.models.ChatRequestSystemMessage;
import com.azure.ai.openai.models.ChatRequestUserMessage;
import com.azure.ai.openai.models.ChatResponseMessage;
import com.azure.ai.openai.models.CompletionsUsage;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.Configuration;

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