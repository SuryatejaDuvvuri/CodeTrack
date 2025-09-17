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
    public List<Map<String,Object>> getRuns(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem, @RequestParam String netId) throws Exception
    {
        return fireStore.getRuns(topic,difficulty,problem,netId);
    }

    @PostMapping
    public void setRuns(@RequestBody Progress entity) {
        fireStore.logAttempt(entity.getTopic(), entity.getDifficulty(), entity.getProblem(), entity.getPassed(), entity.getTotal(), entity.getTimeSpent(), entity.getTestResults(), entity.getCode(), entity.getNetId());
    }

    @GetMapping("/attempts")
    public int getAttempts(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem,@RequestParam String netId) throws Exception 
    {
        return fireStore.getAttempts(topic,difficulty,problem,netId);
    }

    @PostMapping("/update")
    public void setAttempts(@RequestBody Progress entity) throws Exception
    {
        long now = 0;
        if(entity.getAiAttempts() > 0)
        {
            now = System.currentTimeMillis();
        }
        fireStore.setAIAttempts(entity.getTopic(), entity.getDifficulty(), entity.getProblem(), entity.getAiAttempts(), now,entity.getNetId());
    }

    @GetMapping("/latestScore")
    public int getLatestScore(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem, @RequestParam String netId) throws Exception 
    {
        return fireStore.getScore(topic,difficulty,problem,netId);
    }

    @GetMapping("/lastTime")
    public long getLastAttemptTime(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem, @RequestParam String netId) throws Exception 
    {
        return fireStore.getLastAttempt(topic,difficulty,problem,netId);
    }

    @GetMapping("/getTotal")
    public int getProgress(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String netId) throws Exception
    {
        return fireStore.getProgress(topic, difficulty, netId);
    }

    @GetMapping("/ranks")
    public List<Map<String, Object>> getRankings(@RequestParam String netId) throws Exception
    {
        List<Map<String, Object>> ranking = fireStore.getRankings(netId);
        return ranking;
    }
    
    
    
    
    
    
}

class Progress
{
    private String problem;
    private String netId;
    private String topic;
    private String difficulty;
    private int passed;
    private String code;
    private int total;
    private long timeSpent;
    private int aiAttempts;
    private List<Map<String, Object>>  testResults;
    // private long lastAttempt;

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

    public String getCode() 
    { 
        return code; 
    }
    public void setCode(String code) 
    { 
        this.code = code;
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

    public List<Map<String, Object>>  getTestResults()
    {
        return testResults;
    }

    public void setTestResults(List<Map<String, Object>>  testResults)
    {
        this.testResults = testResults;
    }
}
