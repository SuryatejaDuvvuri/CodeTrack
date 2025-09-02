package com.CS010B._bbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    public String grade(@RequestBody CompileRequest req) throws Exception
    {
        fireStore.updateCode(req.getNetId(), req.getProblem(), req.getCode());
        return compileService.compileCode(req.getCode(), req.getTestcases());
    }
}

class CompileRequest
{
    private String code;
    private String testcases;
    private String netId;
    private String problem;

    public void setCode(String code)
    {
        this.code = code;
    }

    public void setTestcases(String testcases)
    {
        this.testcases = testcases;
    }

    public String getCode()
    {
        return code;
    }

    public String getTestcases()
    {
        return testcases;
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
}
