package com.CS010B._bbackend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.FieldValue;
import com.google.firestore.v1.Document;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService 
{
    private Firestore firestore;

    @PostConstruct
    public void initFirestore() throws IOException
    {
        try
        {
            InputStream account = getClass().getResourceAsStream("/firebase-service-account.json");
        
            if(account == null)
            {
                account = new FileInputStream("src/main/resources/firebase-service-account.json");
            }

            FirebaseOptions options = FirebaseOptions.builder().setCredentials(GoogleCredentials.fromStream(account)).build();

            if(FirebaseApp.getApps().isEmpty())
            {
                FirebaseApp.initializeApp(options);
            }

            this.firestore = FirestoreClient.getFirestore();
        }
        catch(IOException e)
        {
            System.err.println("Could not initialize firestore: " + e.getMessage());
            throw e;
        }
    }

    public Map<String,Object> getProblem(String id) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("problems").document(id);
        DocumentSnapshot doc = docRef.get().get();

        return doc.exists() ? doc.getData() : null;
    }

    public Map<String,Object> getStudentProblem(String netId, String problem) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            Map<String,Object> data = doc.getData();
            Map<String,Object> problems = (Map<String,Object>) data.get("Problems");

            if(problems != null)
            {
                if(problems.containsKey("Easy") && problem.startsWith("Easy"))
                {
                    Map<String,Object> easy = (Map<String,Object>)problems.get("Easy");
                    return (Map<String,Object>) easy.get(problem);
                }
                else if(problems.containsKey("Medium") && problem.startsWith("Medium"))
                {
                    Map<String,Object> med = (Map<String,Object>)problems.get("Medium");
                    return (Map<String,Object>) med.get(problem);
                }
                else if(problems.containsKey("Hard") && problem.startsWith("Hard"))
                {
                    Map<String,Object> hard = (Map<String,Object>)problems.get("Hard");
                    return (Map<String,Object>) hard.get(problem);
                }
            }
        }

        return null;
    }

    public void logMessage(String netId, String problem, String userMsg, String aiRes) throws ExecutionException, InterruptedException 
    {
        DocumentReference docRef = firestore.collection("section").document(netId);

        Map<String,Object> chat = new HashMap<>();
        chat.put("timestamp",System.currentTimeMillis());
        chat.put("userMessage", userMsg);
        chat.put("aiResponse", aiRes);
        docRef.update("Problems.Easy." + problem + ".Chat Logs", FieldValue.arrayUnion(chat));

    }
}
