package com.CS010B._bbackend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.io.*;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelExec;

@Service
public class CompileService
{
    private final String HOST = System.getenv("COMPILE_HOST");
    private final String USER = System.getenv("COMPILE_USER");
    private final String KEY = System.getenv("COMPILE_KEY");
    public String compileCode(String code, String testCases) throws Exception
    {
        JSch jsch = new JSch();
        jsch.addIdentity(KEY);
        Session sesh = jsch.getSession(USER,HOST,22);
        sesh.setConfig("StrictHostKeyChecking","no");
        sesh.connect();
        ChannelSftp sftp = (ChannelSftp) sesh.openChannel("sftp");
        sftp.connect();
        sftp.cd("/home/azureuser");
        try(InputStream codeSt = new ByteArrayInputStream(code.getBytes()))
        {
            InputStream tc = new ByteArrayInputStream(testCases.getBytes());
            sftp.put(codeSt, "solution.cpp");
            sftp.put(tc,"testcases.txt");
        }
        finally
        {
            sftp.disconnect();
        }

        ChannelExec exec = (ChannelExec)sesh.openChannel("exec");
        exec.setCommand("bash /home/azureuser/grader.sh");
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        exec.setOutputStream(os);
        exec.setErrStream(os); 
        exec.connect();

        while(!exec.isClosed())
        {
            Thread.sleep(100);
        }
        exec.disconnect();
        sesh.disconnect();

        return os.toString();
    }
}