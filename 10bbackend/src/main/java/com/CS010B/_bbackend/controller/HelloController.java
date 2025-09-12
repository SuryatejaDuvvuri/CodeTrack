package com.CS010B._bbackend.controller;

import java.util.List;

import org.checkerframework.checker.units.qual.A;
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

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class HelloController 
{
    @Autowired
    private BasicChatSample chatSample;

    @Autowired
    private FirestoreService fireStore;


    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) throws Exception
    {
        
        String response = chatSample.getChat(request.getPrompt(), request.getTopic(), request.getDifficulty(), request.getProblem(), request.getNetId());
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

    @PostMapping("/create")
    public void createStudentProblems(@RequestBody ChatRequest request)
    {
        fireStore.createProblems(null);
    }

    // @GetMapping("/test")
    // public ResponseEntity<ChatResponse> test() 
    // {
    //     String response = chatSample.getResponse();
    //     return ResponseEntity.ok(new ChatResponse(response));
    // }
}
