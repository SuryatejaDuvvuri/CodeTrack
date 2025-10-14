package com.CS010B._bbackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS010B._bbackend.model.ChatMessage;
import com.CS010B._bbackend.model.ChatRequest;
import com.CS010B._bbackend.model.ChatResponse;
import com.CS010B._bbackend.service.BasicChatSample;
import com.CS010B._bbackend.service.FirestoreService;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController 
{
    @Autowired
    private BasicChatSample chatSample;

    @Autowired
    private FirestoreService fireStore;


    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) throws Exception
    {
        
        String response = chatSample.getChat(request.getTopic(), request.getDifficulty(), request.getProblem(), request.getPrompt(), request.getNetId());
        return ResponseEntity.ok(new ChatResponse(response));
    }

    @PostMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestBody ChatRequest request) 
    {
        List<ChatMessage> response = chatSample.getHistory(request.getTopic(), request.getDifficulty(),request.getProblem(), request.getNetId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/load")
    public String getCode(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem) throws Exception
    {
        return (String)fireStore.getStarterCode(topic,difficulty,problem);
    }

    @GetMapping("/loadProblem")
    public Map<String,Object> loadProblem(@RequestParam String topic, @RequestParam String difficulty, @RequestParam String problem) throws Exception
    {
        return (Map<String,Object>)fireStore.getProblem(topic, difficulty, problem);
    }

    // @PostMapping("/create")
    // public void createStudentProblems(@RequestBody ChatRequest request)
    // {
    //     fireStore.createProblems(null);
    // }

    @GetMapping("/assigned")
    public List<Map<String, Object>> getAssignedProblems(@RequestParam String netId) throws Exception
    {
        return fireStore.getAssignedProblems(netId);
    }

    @GetMapping("/problems")
    public List<Map<String, Object>> getProblems(@RequestParam String topic, @RequestParam String difficulty) throws Exception
    {
        return fireStore.getProblems(topic,difficulty);
    }
}

class Problem
{
    private String name;
    private String desc;
    private String diff;
    private String examples;

    public String getExamples() {
        return examples;
    }
    public void setExamples(String examples) {
        this.examples = examples;
    }
    public String getName() 
    {
        return name;
    }
    public void setName(String name) 
    {
        this.name = name;
    }
    public String getDesc() 
    {
        return desc;
    }
    public void setDesc(String desc) 
    {
        this.desc = desc;
    }
    public String getDiff() 
    {
        return diff;
    }
    public void setDiff(String diff) 
    {
        this.diff = diff;
    }
}
