package com.CS010B._bbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.List;
import java.util.Map;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelExec;

@Service
public class CompileService
{
    @Value("${compile.host}")
    private String HOST;

    @Value("${compile.user}")
    private String USER;

    @Value("${compile.key}")
    private String KEY;


    public String compileCode(String code, List<Map<String, String>> testCases) throws Exception
    {
        StringBuilder convertCases  = new StringBuilder();
        if(testCases == null)
        {
            return "No test cases yet...";
        }
        for(Map<String,String> testCase: testCases)
        {
            convertCases.append(testCase.get("input"))
                .append("|")
                .append(testCase.get("expectedOutput"))
                .append("|")
                .append(testCase.get("userOutput") != null ? testCase.get("userOutput") : "")
                .append("\n");
        }
        String cases = convertCases.toString();
        JSch jsch = new JSch();
        String keyPath = KEY;
        if (KEY != null && KEY.trim().startsWith("-----BEGIN")) 
        {
            File tmp = File.createTempFile("jsch-key", ".pem");
            try (FileOutputStream fos = new FileOutputStream(tmp)) 
            {
                fos.write(KEY.getBytes());
            }
            tmp.deleteOnExit();
            keyPath = tmp.getAbsolutePath();
        }
        jsch.addIdentity(keyPath);
        Session sesh = jsch.getSession(USER,HOST,22);
        sesh.setConfig("StrictHostKeyChecking","no");
        sesh.connect();
        ChannelSftp sftp = (ChannelSftp) sesh.openChannel("sftp");
        sftp.connect();
        sftp.cd("/home/azureuser");
        try(InputStream codeSt = new ByteArrayInputStream(code.getBytes()))
        {
            InputStream tc = new ByteArrayInputStream(cases.getBytes());
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

        long start = System.currentTimeMillis();

        while(!exec.isClosed())
        {
            Thread.sleep(100);
        }
        exec.disconnect();
        sesh.disconnect();

        return os.toString();
    }
}