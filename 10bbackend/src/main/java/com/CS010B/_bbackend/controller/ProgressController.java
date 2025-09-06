package com.CS010B._bbackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CS010B._bbackend.service.FirestoreService;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/progress")
public class ProgressController 
{
    @Autowired
    private FirestoreService fireStore;

    @GetMapping
    public List<Map<String,Object>> getRuns(@RequestParam String netId, @RequestParam String problem) throws Exception
    {
        return fireStore.getRuns(netId,problem);
    }

    @PostMapping
    public void setRuns(@RequestBody Progress entity) {
        fireStore.logAttempt(entity.getNetId(), entity.getProblem(), entity.getPassed(), entity.getTotal(), entity.getTimeSpent());
    }

    @GetMapping("/attempts")
    public int getAttempts(@RequestParam String netId, @RequestParam String problem) throws Exception 
    {
        return fireStore.getAttempts(netId,problem);
    }

    @PostMapping("/update")
    public void setAttempts(@RequestBody Progress entity) throws Exception
    {
        fireStore.setAIAttempts(entity.getNetId(), entity.getProblem(), entity.getAiAttempts(), System.currentTimeMillis());
    }

    @GetMapping("/latestScore")
    public int getLatestScore(@RequestParam String netId, @RequestParam String problem) throws Exception 
    {
        return fireStore.getScore(netId,problem);
    }
    
    
    
    
    
}

class Progress
{
    private String problem;
    private String netId;
    private int passed;
    private int total;
    private long timeSpent;
    private int aiAttempts;
    private long lastAttempt;

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

    public int getPassed() 
    { 
        return passed; 
    }
    public void setPassed(int passed) 
    { 
        this.passed = passed; 
    }

    public int getTotal() 
    { 
        return total; 
    }
    public void setTotal(int total) 
    { 
        this.total = total; 
    }

    public long getTimeSpent() 
    { 
        return timeSpent; 
    }
    public void setTimeSpent(long timeSpent) 
    { 
        this.timeSpent = timeSpent; 
    }

    public int getAiAttempts()
    {
        return aiAttempts;
    }

    public void setAiAttempts(int aiAttempts)
    {
        this.aiAttempts = aiAttempts;
    }
}
