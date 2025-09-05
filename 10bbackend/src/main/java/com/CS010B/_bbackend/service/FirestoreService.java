package com.CS010B._bbackend.service;

import com.CS010B._bbackend.model.ChatMessage;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
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
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    public Map<String,Object> getProblem(String id, String problem) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("problems").document(id.toLowerCase());
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists() && doc.contains(problem.toLowerCase())) 
        {
            return (Map<String, Object>) doc.get(problem.toLowerCase());
        }
        return null;
    }

    public String getStarterCode(String id, String problem) throws Exception
    {
        Map<String,Object> probDetails = getProblem(id,problem);
        if (probDetails == null) return "";
        return (String)probDetails.get("Startercode");
    }

    public String getCode(String netId, String problem) throws ExecutionException, InterruptedException
    {
        Map<String,Object> probData = (Map<String,Object>) getStudentProblem(netId, problem);
        if (probData == null) return " ";
        String res = (String)probData.get("Latest Code");
        return res == null ? " " : res;
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
        String difficulty = problem.startsWith("Easy") ? "Easy" : problem.startsWith("Medium") ? "Medium" : "Hard";
        docRef.update("Problems." + difficulty + "." + problem + ".Chat Logs", FieldValue.arrayUnion(chat));
    }

    public void storeTests(String problem, String solution, List<Map<String,String>> testCases)
    {
        String difficulty = problem.startsWith("Easy") ? "easy" : problem.startsWith("Medium") ? "medium" : "hard";
        DocumentReference docRef = firestore.collection("problems").document(difficulty);
        Map<String, Object> problemMap = new HashMap<>();
        problemMap.put("Testcases", testCases);
        problemMap.put("solution", solution);
        
        Map<String, Object> updates = new HashMap<>();
        updates.put(problem.toLowerCase(), problemMap);
        docRef.set(updates, SetOptions.merge());
    }

    public List<Map<String,String>> getTests(String problem) throws Exception
    {
        String prob = problem.toLowerCase();
        String difficulty = prob.startsWith("easy") ? "easy" :
                        prob.startsWith("medium") ? "medium" : "hard";
        DocumentReference docRef = firestore.collection("problems").document(difficulty);
        DocumentSnapshot doc = docRef.get().get();
        if(doc.exists() && doc.contains(prob))
        {
            System.out.println("Found problem field: " + problem.toLowerCase());
            Map<String, Object> probMap = (Map<String, Object>) doc.get(prob);
            if(probMap != null && probMap.containsKey("Testcases"))
            {
                
                Object rawTestcases = probMap.get("Testcases");
                if(rawTestcases instanceof List)
                {
                    System.out.println("here");
                    return (List<Map<String,String>>) rawTestcases;
                }
            }
        }

        return new ArrayList<>();
    }

    public List<ChatMessage> loadChats(String problem, String netId) throws ExecutionException, InterruptedException 
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            Map<String,Object> data = doc.getData();
            Map<String,Object> problems = (Map<String,Object>) data.get("Problems");
            Map<String,Object> details = null;
            
            if(problems != null)
            {
                if(problems.containsKey("Easy") && problem.startsWith("Easy"))
                {
                    details = (Map<String,Object>)problems.get("Easy");
                }
                else if(problems.containsKey("Medium") && problem.startsWith("Medium"))
                {
                    details = (Map<String,Object>)problems.get("Medium");
                }
                else if(problems.containsKey("Hard") && problem.startsWith("Hard"))
                {
                    details = (Map<String,Object>)problems.get("Hard");
                }

                if(details == null) 
                {
                    return new ArrayList<>();
                }
                Map<String,Object> probData = (Map<String,Object>) details.get(problem);
                if(probData == null) 
                {
                    return new ArrayList<>();
                }
                List<Map<String,Object>> logs =  (List<Map<String,Object>>) probData.get("Chat Logs");
                if(logs == null) 
                {
                    return new ArrayList<>();
                }
                List<ChatMessage> messages = new ArrayList<>();
                
                for(Map<String,Object> chat: logs)
                {
                    String userMsg = chat.get("userMessage") != null ? chat.get("userMessage").toString() : "";
                    String aiRes = chat.get("aiResponse") != null ? chat.get("aiResponse").toString() : "";
                    if (userMsg.isEmpty() && aiRes.isEmpty())
                    {
                        continue;
                    }
                    ChatMessage msg = new ChatMessage();
                    Object tsObj = chat.get("timestamp");
                    LocalDateTime timestamp = null;
                    if (tsObj instanceof Long) 
                    {
                        timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli((Long) tsObj), ZoneId.systemDefault());
                    } else if (tsObj instanceof Integer) 
                    {
                        timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli(((Integer) tsObj).longValue()), ZoneId.systemDefault());
                    }
                    msg.setTimestamp(timestamp);
                    msg.setUserMessage(userMsg);
                    msg.setAiResponse(aiRes);

                    messages.add(msg);
                }
                return messages;

            }
        }
        return new ArrayList<>();
    }

    public void updateCode(String netId, String problem, String code) throws ExecutionException, InterruptedException
    {
        String difficulty = problem.startsWith("Easy") ? "Easy" : problem.startsWith("Medium") ? "Medium" : "Hard";
        DocumentReference docRef = firestore.collection("section").document(netId);
        docRef.update("Problems." + difficulty + "." + problem + ".Latest Code", code);
    }

}
