package com.CS010B._bbackend.controller;

import java.util.List;
import java.util.Map;

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
@RequestMapping("/api/instructor")
public class InstructorController 
{

    @Autowired
    private FirestoreService fireStore;


    @GetMapping("/roster")
    public List<Map<String,Object>> getRoster() throws Exception
    {
        return fireStore.getStudents();
    }    

    @GetMapping("/studentDetails")
    public Map<String, Object> getStudentDetails(@RequestParam String netId) throws Exception 
    {
        return fireStore.getStudentDetails(netId);
    }

    @GetMapping("/assigned")
    public List<Map<String, Object>> getAssignedProblems(@RequestParam String netId) throws Exception 
    {
        return fireStore.getAssignedProblems(netId);
    }

    @PostMapping("/assignProblems")
    public void assignProblems(@RequestBody AssignedProblems problemsAssigned)
    {

    }

    @PostMapping("/addStudent")
    public void addStudent(@RequestBody Map<String,String> req)
    {
        
    }
}

class AssignedProblems
{
    private String netId;
    private String problems;
    private String dueDate;

    public String getNetId() 
    {
        return netId;
    }
    public void setNetId(String netId) 
    {
        this.netId = netId;
    }
    public String getProblems() 
    {
        return problems;
    }
    public void setProblems(String problems) 
    {
        this.problems = problems;
    }
    public String getDueDate() 
    {
        return dueDate;
    }
    public void setDueDate(String dueDate) 
    {
        this.dueDate = dueDate;
    }
}
