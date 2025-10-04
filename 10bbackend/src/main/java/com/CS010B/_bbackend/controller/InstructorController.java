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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    public void assignProblems(@RequestBody AssignedProblems req) throws Exception
    {
        fireStore.assignProblems(req.getNetId(), req.getProblems());
    }

    @PostMapping("/assignProblemsAll")
    public void assignProblemsAll(@RequestBody Map<String, Object> req) throws Exception
    {
        fireStore.assignProblemsAll((List<Map<String, Object>>)req.get("problems"));
    }

    @PostMapping("/addStudent")
    public void addStudent(@RequestBody Map<String,String> req) throws Exception
    {
        fireStore.addStudent("sduvv003", req.get("netId"), req.get("name"), req.get("email"), req.get("password"), req.get("role"));
    }
    @PostMapping("/removeStudent")
    public void removeStudent(@RequestBody Map<String,String> req) throws Exception
    {
        fireStore.removeStudent(req.get("netId"));
    }

    @PostMapping("/create")
    public void createProblem(@RequestBody Map<String,Object> req) throws Exception
    {
        fireStore.createProblems(req);
    }
}

class AssignedProblems
{
    private String netId;
    private List<Map<String, Object>>  problems;
    private String dueDate;

    public String getNetId() 
    {
        return netId;
    }
    public void setNetId(String netId) 
    {
        this.netId = netId;
    }
    public List<Map<String, Object>>  getProblems() 
    {
        return problems;
    }
    public void setProblems(List<Map<String, Object>> problems) 
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
