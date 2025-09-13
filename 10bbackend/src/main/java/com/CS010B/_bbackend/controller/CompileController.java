package com.CS010B._bbackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CS010B._bbackend.service.BasicChatSample;
import com.CS010B._bbackend.service.CompileService;
import com.CS010B._bbackend.service.FirestoreService;

@RestController
@RequestMapping("/api/grade")
public class CompileController 
{
    @Autowired
    private CompileService compileService;

    @Autowired
    private FirestoreService fireStore;

    @Autowired
    private BasicChatSample chatSample;

    @PostMapping
    public String grade(@RequestBody CompileRequest req) throws Exception
    {
        fireStore.updateCode(req.getTopic(), req.getDifficulty(), req.getProblem(), req.getCode(),req.getNetId());
        chatSample.getChat(req.getTopic(), req.getDifficulty(), req.getProblem()," ", req.getNetId());
        List<Map<String,String>> testCases = fireStore.getTests(req.getTopic(), req.getDifficulty(), req.getProblem());
        return compileService.compileCode(req.getCode(), testCases);
        
    }

    @PostMapping("/update")
    public void update(@RequestBody CompileRequest req) throws Exception
    {
        fireStore.updateCode(req.getTopic(), req.getDifficulty(), req.getProblem(), req.getCode(),req.getNetId());
    }
    
    

    @GetMapping("/code")
    public String loadCode(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem, @RequestParam String netId) throws Exception
    {
        return fireStore.getCode(topic,difficulty,problem,netId);
    }
}

class CompileRequest
{
    private String code;
    private String netId;
    private String problem;
    private String topic;
    private String difficulty;

    public void setCode(String code)
    {
        this.code = code;
    }

    public String getCode()
    {
        return code;
    }

    public String getNetId()
    {
        return netId;
    }

    public String getProblem()
    {
        return problem;
    }
    

    public void setNetId(String netId)
    {
        this.netId = netId;
    }

    public void setProblem(String problem)
    {
        this.problem = problem;
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
