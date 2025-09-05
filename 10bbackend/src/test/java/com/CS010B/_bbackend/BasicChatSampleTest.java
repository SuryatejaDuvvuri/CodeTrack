package com.CS010B._bbackend;

import com.CS010B._bbackend.service.BasicChatSample;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
public class BasicChatSampleTest {
    
    @Autowired
    private BasicChatSample aiService;
    
    @Test
    public void testChat() 
    {
        System.out.println("Response from Azure OpenAI:");
        System.out.println("-------------------------");
        // System.out.println(aiService.getResponse());
        System.out.println("-------------------------");
    }
    
}