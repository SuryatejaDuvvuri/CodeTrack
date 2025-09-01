package com.CS010B._bbackend.model;

import java.time.LocalDateTime;

public class ChatMessage 
{
    private String id;
    private String content;
    private String role;
    private LocalDateTime timestamp;
    private String problem;
    private String netId;
    private String userMessage;
    private String aiResponse;

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getContent() 
    {
        return content;
    }

    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getRole() 
    {
        return role;
    }

    public void setRole(String role) 
    {
        this.role = role;
    }

    public LocalDateTime getTimestamp() 
    {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) 
    {
        this.timestamp = timestamp;
    }

    public String getProblem()
    {
        return problem;
    }

    public void setProblem(String problem)
    {
        this.problem = problem;
    }

    public String getNetId()
    {
        return netId;
    }

    public void setNetId(String netId)
    {
        this.netId = netId;
    }

    public String getUserMessage()
    {
        return userMessage;
    }
    public String getAiResponse()
    {
        return aiResponse;
    }

    public void setUserMessage(String userMessage) 
    {
        this.userMessage = userMessage;
    }

    public void setAiResponse(String aiResponse)
    {
        this.aiResponse = aiResponse;
    }
}
