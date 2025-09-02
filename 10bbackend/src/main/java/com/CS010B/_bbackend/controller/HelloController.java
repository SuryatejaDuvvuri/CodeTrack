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


    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) 
    {
        String response = chatSample.getChat(request.getPrompt(), request.getProblem(), request.getNetId());
        return ResponseEntity.ok(new ChatResponse(response));
    }

    @PostMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestBody ChatRequest request) 
    {
        List<ChatMessage> response = chatSample.getHistory(request.getProblem(), request.getNetId() != null ? request.getNetId():"default");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<ChatResponse> test() 
    {
        String response = chatSample.getResponse();
        return ResponseEntity.ok(new ChatResponse(response));
    }
}
