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
import java.lang.reflect.Field;
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

    public Map<String,Object> getProblem(String topic, String difficulty, String problem) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("problems").document(topic);
        DocumentSnapshot doc = docRef.get().get();
        Map<String,Object> diff = (Map<String,Object>) doc.get(difficulty);
        Map<String,Object> details = (Map<String,Object>) diff.get(problem);
        if(doc.exists() && details != null)
        {
            return details;
        }
        return null;
    }

    public String getStarterCode(String topic, String difficulty, String problem) throws Exception
    {
        Map<String,Object> probDetails = getProblem(topic,difficulty,problem);
        if (probDetails == null) return "";
        return (String)probDetails.get("Starter Code");
    }

    public int getProgress(String topic, String difficulty, String netId) throws Exception 
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            Map<String,Object> problemsMap = (Map<String, Object>)doc.get("Problems");
            Map<String,Object> topicMap = (Map<String, Object>)problemsMap.get(topic);
            Map<String,Object> diffMap = (Map<String, Object>)topicMap.get(difficulty);

            double totalProg = 0.0;
            int count = 0;

            for(int i = 1; i <= 15; i++)
            {
                String probName = difficulty + " " + i;
                Map<String,Object> details = (Map<String, Object>)diffMap.get(probName);
                if(details != null)
                {
                    double score = ((Number)details.get("Latest Score")).doubleValue();

                    if(score >= 80.0)
                    {
                        totalProg += 1.0;
                    }
                    else if(score > 0)
                    {
                        totalProg += (score/80.0);
                    }

                }
                count++;
            }

            if(count <= 0)
            {
                return 0;
            }
            return (int)Math.round((totalProg / 15.0) * 100.0);
        }

        return 0;
    }

    public List<Map<String,Object>> getRankings(String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        Map<String, Map<String, Object>> combined = new HashMap<>();

        if(doc.exists())
        {
            Map<String,Object> problems = (Map<String,Object>)doc.get("Problems");
            
            if(problems != null)
            {
                for(String topic: problems.keySet())
                {
                    String normTopic = topic.replaceAll("\\s*\\d+$", "").trim().toLowerCase();
                    Map<String,Object> topics = (Map<String,Object>)problems.get(topic);
                    double totalScore = 0.0;
                    int totalAttempts = 0;
                    int count = 0;
                    if(topics != null)
                    {
                        for(String diff: topics.keySet())
                        {
                            Map<String,Object> diffMap = (Map<String,Object>)topics.get(diff);
                            
                            if(diffMap != null)
                            {
                                for(String probName : diffMap.keySet())
                                {
                                    Object obj = diffMap.get(probName);
                                    if (!(obj instanceof Map)) 
                                    {
                                        System.out.println(obj);
                                        continue;
                                    }
                                    Map<String, Object> details = (Map<String, Object>)obj;
                                    if(details != null)
                                    {
                                        double score = ((Number)details.get("Latest Score")).doubleValue();
                                        int attempts =  ((List<Map<String,Object>>)details.get("Runs")).size();
                                        totalScore += score;
                                        totalAttempts += attempts;
                                        count++;
                                    }
                                }
                            }

                        }

                        if(count > 0)
                        {
                            double avgScore = totalScore/count;
                            double avgAttempts = totalAttempts/(double)count;
                            double strength = avgScore / (avgAttempts > 0 ? avgAttempts : 1);
                            if(combined.containsKey(normTopic))
                            {
                                double prevStrength = (double)combined.get(normTopic).get("strength");
                                double newStrength = Math.min(prevStrength + strength, 100.0);
                                combined.get(normTopic).put("strength", newStrength);
                            }
                            else
                            {
                                Map<String,Object> topicRank = new HashMap<>();
                                normTopic = normTopic.length() > 0 ? Character.toUpperCase(normTopic.charAt(0)) + normTopic.substring(1) : normTopic;
                                topicRank.put("topic",normTopic);
                                topicRank.put("strength",Math.min(strength, 100.0));
                                combined.put(normTopic,topicRank);
                            }
                        }
                    }
                }
            }
        }
        List<Map<String, Object>> ranking = new ArrayList<>(combined.values());
        ranking.sort((a, b) -> Double.compare((double) b.get("strength"), (double) a.get("strength")));
        return ranking;
    }

    public String getCode(String topic, String difficulty, String problem,String netId) throws ExecutionException, InterruptedException
    {
        Map<String,Object> probData = (Map<String,Object>) getStudentProblem(topic,difficulty,problem,netId);
        if (probData == null) return " ";
        String res = (String)probData.get("Latest Code");
        return res == null ? " " : res;
    }

    public Map<String,Object> getStudentProblem(String topic, String difficulty, String problem, String netId) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            Map<String, Object> problemsMap = (Map<String, Object>) doc.get("Problems");
            Map<String, Object> topicMap = (Map<String, Object>) problemsMap.get(topic);
            Map<String, Object> difficultyMap = (Map<String, Object>) topicMap.get(difficulty);
            // Map<String,Object> details = (Map<String,Object>)doc.get(problem);
            // Map<String,Object> data = doc.getData();
            Map<String,Object> problems = (Map<String,Object>) difficultyMap.get(problem);

            if(problems != null)
            {
                // if(problems.containsKey("Easy") && problem.startsWith("Easy"))
                // {
                //     Map<String,Object> easy = (Map<String,Object>)problems.get("Easy");
                //     return (Map<String,Object>) easy.get(problem);
                // }
                // else if(problems.containsKey("Medium") && problem.startsWith("Medium"))
                // {
                //     Map<String,Object> med = (Map<String,Object>)problems.get("Medium");
                //     return (Map<String,Object>) med.get(problem);
                // }
                // else if(problems.containsKey("Hard") && problem.startsWith("Hard"))
                // {
                //     Map<String,Object> hard = (Map<String,Object>)problems.get("Hard");
                //     return (Map<String,Object>) hard.get(problem);
                // }
                return problems;
            }
        }

        return null;
    }

    public void logMessage(String topic, String difficulty, String problem, String userMsg, String aiRes, String netId) throws ExecutionException, InterruptedException 
    {
        DocumentReference docRef = firestore.collection("section").document(netId);

        Map<String,Object> chat = new HashMap<>();
        chat.put("timestamp",System.currentTimeMillis());
        chat.put("userMessage", userMsg);
        chat.put("aiResponse", aiRes);
        // String diff = problem.startsWith("Easy") ? "Easy" : problem.startsWith("Medium") ? "Medium" : "Hard";
        docRef.update("Problems." + topic + "." + difficulty + "." + problem + ".Chat Logs", FieldValue.arrayUnion(chat));
    }

    public void storeTests(String topic, String difficulty, String problem, String solution, List<Map<String,String>> testCases)
    {
        // String difficulty = problem.startsWith("Easy") ? "easy" : problem.startsWith("Medium") ? "medium" : "hard";
        DocumentReference docRef = firestore.collection("problems").document(topic);
        Map<String, Object> problemMap = new HashMap<>();
        problemMap.put("Testcases", testCases);
        problemMap.put("Solution", solution);

        Map<String, Object> difficultyMap = new HashMap<>();
        difficultyMap.put(problem, problemMap);

        Map<String, Object> updates = new HashMap<>();
        updates.put(difficulty, difficultyMap);

        docRef.set(updates, SetOptions.merge());
    }

    public List<Map<String,String>> getTests(String topic, String difficulty, String problem) throws Exception
    {
        // String prob = problem.toLowerCase();
        // String difficulty = prob.startsWith("easy") ? "easy" :
                        // prob.startsWith("medium") ? "medium" : "hard";
        DocumentReference docRef = firestore.collection("problems").document(topic);
        DocumentSnapshot doc = docRef.get().get();
        if(doc.exists())
        {
            Map<String, Object> difficultyMap = (Map<String, Object>) doc.get(difficulty);
            Map<String, Object> probMap = (Map<String, Object>) difficultyMap.get(problem);
            if(probMap != null && probMap.containsKey("Testcases"))
            {
                
                Object rawTestcases = probMap.get("Testcases");
                if(rawTestcases instanceof List)
                {
                    return (List<Map<String,String>>) rawTestcases;
                }
            }
        }

        return new ArrayList<>();
    }

    public List<ChatMessage> loadChats(String topic, String difficulty, String problem, String netId) throws ExecutionException, InterruptedException 
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            // Map<String,Object> problems = (Map<String,Object>)doc.get(problem);
            // Map<String,Object> problems = (Map<String,Object>) data.get("Problems");
            Map<String, Object> problemsMap = (Map<String, Object>) doc.get("Problems");
            if(problemsMap != null)
            {
                Map<String, Object> topicMap = (Map<String, Object>) problemsMap.get(topic);

                if(topicMap != null)
                {
                    Map<String, Object> difficultyMap = (Map<String, Object>) topicMap.get(difficulty);
                    
                    if(difficultyMap != null)
                    {
                        Map<String,Object> details = (Map<String,Object>)difficultyMap.get(problem);
                        if(details == null) 
                        {
                            return new ArrayList<>();
                        }

                        List<Map<String,Object>> logs =  (List<Map<String,Object>>) details.get("Chat Logs");
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

            }
                // if(problems.containsKey("Easy") && problem.startsWith("Easy"))
                // {
                //     details = (Map<String,Object>)problems.get("Easy");
                // }
                // else if(problems.containsKey("Medium") && problem.startsWith("Medium"))
                // {
                //     details = (Map<String,Object>)problems.get("Medium");
                // }
                // else if(problems.containsKey("Hard") && problem.startsWith("Hard"))
                // {
                //     details = (Map<String,Object>)problems.get("Hard");
                // }

            // if(details == null) 
            // {
            //     return new ArrayList<>();
            // }
                // Map<String,Object> probData = (Map<String,Object>) details.get(problem);
                // if(probData == null) 
                // {
                //     return new ArrayList<>();
                // }
            // List<Map<String,Object>> logs =  (List<Map<String,Object>>) details.get("Chat Logs");
            // if(logs == null) 
            // {
            //     return new ArrayList<>();
            // }
            // List<ChatMessage> messages = new ArrayList<>();
            
            // for(Map<String,Object> chat: logs)
            // {
            //     String userMsg = chat.get("userMessage") != null ? chat.get("userMessage").toString() : "";
            //     String aiRes = chat.get("aiResponse") != null ? chat.get("aiResponse").toString() : "";
            //     if (userMsg.isEmpty() && aiRes.isEmpty())
            //     {
            //         continue;
            //     }
            //     ChatMessage msg = new ChatMessage();
            //     Object tsObj = chat.get("timestamp");
            //     LocalDateTime timestamp = null;
            //     if (tsObj instanceof Long) 
            //     {
            //         timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli((Long) tsObj), ZoneId.systemDefault());
            //     } else if (tsObj instanceof Integer) 
            //     {
            //         timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli(((Integer) tsObj).longValue()), ZoneId.systemDefault());
            //     }
            //     msg.setTimestamp(timestamp);
            //     msg.setUserMessage(userMsg);
            //     msg.setAiResponse(aiRes);

            //     messages.add(msg);
            // }
            // return messages;

            
        }
        return new ArrayList<>();
    }

    public void updateCode(String topic, String difficulty, String problem, String code,String netId) throws ExecutionException, InterruptedException
    {
        // String difficulty = problem.startsWith("Easy") ? "Easy" : problem.startsWith("Medium") ? "Medium" : "Hard";
        DocumentReference docRef = firestore.collection("section").document(netId);
        docRef.update("Problems." + topic + "." + difficulty + "." + problem + ".Latest Code", code);
    }

    public void logAttempt(String topic, String difficulty, String problem, int passed, int total, long timeSpent,List<Map<String, Object>>  testResults, String netId)
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";
        Map<String,Object> run = new HashMap<>();
        double latestScore = total > 0 ? (passed * 100.0 / total) : 0;
        run.put("timestamp",System.currentTimeMillis());
        // run.put("problem",problem);
        run.put("passed", passed);
        run.put("total", total);
        run.put("successRate", total > 0 ? (passed * 100.0 / total) : 0);
        run.put("timeSpent", timeSpent / 1000);
        run.put("testResults", testResults);
        docRef.update("Problems." + topic + "." + difficulty + "." + problem  + ".Runs", FieldValue.arrayUnion(run));
        docRef.update("Problems." + topic + "." + difficulty + "." + problem  + ".Latest Score", latestScore);

    }

    public List<Map<String,Object>> getRuns(String topic, String difficulty, String problem, String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";
        if(doc.exists())
        {
            // Map<String,Object> problems = (Map<String, Object>)doc.get(problem);
            Map<String,Object> problems = (Map<String, Object>) doc.get("Problems");
            if(problems != null)
            {
                // return (List<Map<String, Object>>) problems.get(topic);

                Map<String, Object> topics = (Map<String, Object>) problems.get(topic);
                if(topics != null)
                {
                    Map<String, Object> diff = (Map<String, Object>) topics.get(difficulty);
                    if (diff != null) 
                    {
                        Map<String, Object> probMap = (Map<String, Object>) diff.get(problem);

                        if (probMap != null)
                        {   
                            return (List<Map<String, Object>>) probMap.get("Runs");
                        }
                    }
                }
                // if (diff != null && diff.containsKey(problem)) 
                // {
                //     Map<String, Object> probMap = (Map<String, Object>) diff.get(problem);
                //     if (probMap != null && probMap.containsKey("Runs")) 
                //     {
                //         return (List<Map<String, Object>>) probMap.get("Runs");
                //     }
                // }
            }
        }

        return new ArrayList<>();
    }

    public int getAttempts(String topic, String difficulty, String problem,String netId) throws Exception
    {
        DocumentReference docRef =  firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";

        if(doc.exists())
        {
            // Map<String,Object> data = doc.getData();
            // Map<String,Object> problems = (Map<String, Object>) doc.get("Problems");
            // if(problems != null && problems.containsKey(difficulty))
            // {
                Map<String, Object> problemsMap = (Map<String, Object>) doc.get("Problems");
                Map<String, Object> topicMap = (Map<String, Object>) problemsMap.get(topic);
                Map<String, Object> difficultyMap = (Map<String, Object>) topicMap.get(difficulty);
                Map<String, Object> probMap = (Map<String, Object>) difficultyMap.get(problem);
                // if (diff != null) 
                // {
                    // Map<String, Object> probMap = (Map<String, Object>) diff.get(problem);
                    if (probMap != null) 
                    {
                        int attempts = probMap.containsKey("# of AI Attempts") ? ((Number) probMap.get("# of AI Attempts")).intValue() : 0;
                        long lastAttempt = probMap.containsKey("lastAIAttempt") ? ((Number) probMap.get("lastAIAttempt")).longValue() : 0L;
                        // System.out.println(attempts);
                        // System.out.println(lastAttempt);
                        long now = System.currentTimeMillis();
                        long hours = (now-lastAttempt) / (1000*3600);

                        // if(attempts > 0 && lastAttempt > 0 && hours >= 5)
                        // {
                        //     setAIAttempts(topic,difficulty,problem, 0,now,netId);
                        //     return 0;
                        // }
                        return attempts;
                    }
                // }
            // }
        }
        return 0;
    }

    public long getLastAttempt(String topic, String difficulty, String problem, String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";

        if(doc.exists())
        {
            // Map<String,Object> data = doc.getData();
            // Map<String,Object> problems = (Map<String, Object>) data.get("Problems");
            // if(problems != null && problems.containsKey(difficulty))
            // {
                // Map<String, Object> diff = (Map<String, Object>) problems.get(difficulty);
                // if (diff != null && diff.containsKey(problem)) 
            
            Map<String, Object> problemsMap = (Map<String, Object>) doc.get("Problems");
            Map<String, Object> topicMap = (Map<String, Object>) problemsMap.get(topic);
            Map<String, Object> difficultyMap = (Map<String, Object>) topicMap.get(difficulty);
            Map<String, Object> probMap = (Map<String, Object>) difficultyMap.get(problem);
            if (probMap != null) 
            {
                long lastAttempt = probMap.containsKey("lastAIAttempt") ? ((Number) probMap.get("lastAIAttempt")).longValue() : 0L;
                return lastAttempt;
            }
                
            // }
        }
        return 0;
    }

    public void setAIAttempts(String topic, String difficulty, String problem, int aiAttempts, long lastAttempt, String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";
        Map<String, Object> updates = new HashMap<>();
        updates.put("Problems." + topic + "." + difficulty + "." + problem  + ".# of AI Attempts", aiAttempts);
        updates.put("Problems." + topic + "." + difficulty + "." + problem  + ".lastAIAttempt", lastAttempt);

        docRef.update(updates).get();
    }

    public int getScore(String topic, String difficulty, String problem, String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        // String difficulty = problem.startsWith("Easy") ? "Easy" :
        //                 problem.startsWith("Medium") ? "Medium" : "Hard";

        if(doc.exists())
        {
            // Map<String,Object> data = doc.getData();
            Map<String, Object> problemsMap = (Map<String, Object>) doc.get("Problems");
            Map<String, Object> topicMap = (Map<String, Object>) problemsMap.get(topic);
            Map<String, Object> difficultyMap = (Map<String, Object>) topicMap.get(difficulty);
            Map<String, Object> problems = (Map<String, Object>) difficultyMap.get(problem);
            if(problems != null)
            {
                // Map<String, Object> diff = (Map<String, Object>) problems.get(difficulty);
                // if (diff != null && diff.containsKey(problem)) 
                // {
                    // Map<String, Object> probMap = (Map<String, Object>) problems.get(problem);
                    // if (probMap != null) 
                    // {
                int score = 0;
                Object scoreObj = problems.get("Latest Score");
                if(scoreObj instanceof Number)
                {
                    score = ((Number)scoreObj).intValue();
                }
                return score;
                    // }
                // }
            }
        }
        return 0;
    }

    public void createProblems(String t) 
    {
        DocumentReference docRef = firestore
            .collection("section")
            .document("sduvv003");

        String[] difficulties = {"Easy", "Medium", "Hard"};
        Map<String, Object> problemsMap = new HashMap<>();
        Map<String, Object> topicMap = new HashMap<>();
        String topic = "Linked List 2";

        for (String difficulty : difficulties) {
            Map<String, Object> difficultyMap = new HashMap<>();
            for (int i = 1; i <= 15; i++) 
            {
                String problem = difficulty + " " + i;
                difficultyMap.put(problem, createProblemData());
            }
            topicMap.put(difficulty, difficultyMap);
        }

        problemsMap.put(topic, topicMap);
        Map<String, Object> update = new HashMap<>();
        update.put("Problems", problemsMap);
        docRef.set(update, SetOptions.merge());
    }

    public Map<String, Object> createProblemData() 
    {
        Map<String, Object> data = new HashMap<>();
        data.put("# of AI Attempts", 0);
        data.put("Chat Logs", new ArrayList<Map<String, Object>>());
        data.put("Due Date", 0);
        data.put("Latest Code", "");
        data.put("Latest Score", 0);
        data.put("Runs", new ArrayList<Map<String, Object>>());
        data.put("lastAIAttempt", 0);
        return data;
    }

}
