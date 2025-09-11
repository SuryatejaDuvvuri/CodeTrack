package com.CS010B._bbackend.model;

public class ChatRequest 
{
    private String prompt;
    private String problem;
    private String netId;
    private String topic;
    private String difficulty;

    public String getPrompt() 
    {
        return prompt;
    }

    public void setPrompt(String prompt) 
    {
        this.prompt = prompt;
    }

    public String getProblem() 
    {
        return problem;
    }

    public void setProblem(String problem) 
    {
        this.problem = problem;
    }

    public String getNetId() {
        return netId;
    }

    public void setNetId(String netId) {
        this.netId = netId;
    }

    public String getTopic()
    {
        return topic;
    }

    public void setTopic(String topic)
    {
        this.topic = topic;
    }

    public String getDifficulty()
    {
        return difficulty;
    }

    public void setDifficulty(String difficulty)
    {
        this.difficulty = difficulty;
    }
}
