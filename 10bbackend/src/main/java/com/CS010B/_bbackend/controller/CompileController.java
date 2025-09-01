package com.CS010B._bbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS010B._bbackend.service.CompileService;

@RestController
@RequestMapping("/api/grade")
public class CompileController 
{
    @Autowired
    private CompileService compileService;

    @PostMapping
    public String grade(@RequestBody CompileRequest req) throws Exception
    {
        return compileService.compileCode(req.getCode(), req.getTestcases());
    }
}

class CompileRequest
{
    private String code;
    private String testcases;

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
}
