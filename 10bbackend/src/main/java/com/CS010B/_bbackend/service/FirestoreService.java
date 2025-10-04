package com.CS010B._bbackend.service;

import com.CS010B._bbackend.model.ChatMessage;
import com.CS010B._bbackend.model.User;
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
            if (problemsMap == null) return 0;
            Map<String,Object> topicMap = (Map<String, Object>)problemsMap.get(topic);
            if (topicMap == null) return 0;
            Map<String,Object> diffMap = (Map<String, Object>)topicMap.get(difficulty);
            if (diffMap == null) return 0;

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

    public void logAttempt(String topic, String difficulty, String problem, int passed, int total, long timeSpent,List<Map<String, Object>> testResults, String code, String netId)
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
        run.put("code", code);
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

    public void createProblems(Map<String,Object> req) throws Exception 
    {
        String topic = (String)req.get("topic");
        String difficulty = (String) req.get("difficulty");
        int difficultyVal = 0;
        String name = (String) req.get("name");
        String description = (String) req.get("description");
        String starterCode = (String) req.get("starterCode");
        String examples = (String) req.get("examples");

        switch(difficulty)
        {
            case "Easy": difficultyVal = 2;
            case "Medium": difficultyVal = 5;
            case "Hard": difficultyVal = 9;
            default: difficultyVal = 1;
        }

        Map<String,Object> data = new HashMap<>();
        data.put("Description", description);
        data.put("Starter Code", starterCode);
        data.put("Examples", examples);
        data.put("Difficulty", difficultyVal);
        data.put("Problem", name);
        
        DocumentReference docRef = firestore.collection("problems").document(topic);
        DocumentSnapshot snap = docRef.get().get();
        Map<String,Object> probData = snap.getData();
        int val = 1;
        if(probData != null && probData.containsKey(difficulty))
        {
            Map<String, Object> diffMap = (Map<String, Object>) probData.get(difficulty);
            if (diffMap != null) 
            {
                val = diffMap.size() + 1;
            }
        }

        String problemId = difficulty + " " + val;
        Map<String,Object> diffMap = new HashMap<>();
        diffMap.put(problemId,data);
        Map<String,Object> update = new HashMap<>();
        update.put(difficulty, diffMap);
        docRef.set(update,SetOptions.merge()).get();


        for(DocumentSnapshot student : firestore.collection("section").get().get().getDocuments())
        {
            String netId = student.getId();
            DocumentReference studentRef = firestore.collection("section").document(netId);
            
            DocumentSnapshot studentDoc = studentRef.get().get();
            Map<String,Object> problemsMap = (Map<String,Object>)studentDoc.get("Problems");
            int nextVal = 1;
            if(problemsMap != null && problemsMap.containsKey(topic))
            {
                Map<String,Object> topicMap = (Map<String,Object>)problemsMap.get(topic);
                if(topicMap != null && topicMap.containsKey(difficulty))
                {
                    Map<String,Object> diffMapStudent = (Map<String,Object>) topicMap.get(difficulty);
                    if(diffMapStudent != null)
                    {
                        nextVal = diffMapStudent.size() + 1;
                    }
                }
            }

            String probName = difficulty + " " + nextVal;
            Map<String,Object> studentData = createProblemData();

            if (problemsMap == null) 
            {
                problemsMap = new HashMap<>();
            }

            Map<String,Object> topicMap = problemsMap.containsKey(topic) ?
            (Map<String,Object>)problemsMap.get(topic) : new HashMap<>();

            Map<String,Object> diffMapStudent = topicMap.containsKey(difficulty) ?
            (Map<String,Object>)topicMap.get(difficulty) : new HashMap<>();


            diffMapStudent.put(probName, studentData);
            topicMap.put(difficulty,diffMapStudent);
            problemsMap.put(topic,topicMap);
        
            Map<String, Object> updates = new HashMap<>();
            updates.put("Problems",problemsMap);
            studentRef.set(updates, SetOptions.merge()).get();
        }
        
        

            // DocumentReference docRef = firestore
            //     .collection("section")
            //     .document("sduvv003");

            // String[] difficulties = {"Easy", "Medium", "Hard"};
            // Map<String, Object> problemsMap = new HashMap<>();
            // Map<String, Object> topicMap = new HashMap<>();
            // String topic = "Linked List 2";

            // for (String difficulty : difficulties) {
            //     Map<String, Object> difficultyMap = new HashMap<>();
            //     for (int i = 1; i <= 15; i++) 
            //     {
            //         String problem = difficulty + " " + i;
            //         difficultyMap.put(problem, createProblemData());
            //     }
            //     topicMap.put(difficulty, difficultyMap);
            // }

            // problemsMap.put(topic, topicMap);
            // Map<String, Object> update = new HashMap<>();
            // update.put("Problems", problemsMap);
            // docRef.set(update, SetOptions.merge());
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

    public void addWarmUpProblemsForStudent(String netId) throws Exception {
        // String[] warmUps = {"Warm Up 1", "Warm Up 2"};
        // String difficulty = "Easy";
        // DocumentReference studentRef = firestore.collection("section").document(netId);
        // DocumentSnapshot doc = studentRef.get().get();
        // Map<String, Object> problems = (Map<String, Object>) doc.get("Problems");
        // if (problems == null) problems = new HashMap<>();

        // for (String warmUp : warmUps) {
        //     Map<String, Object> problemsMap = new HashMap<>();
        //     Map<String, Object> diffMap = new HashMap<>();
        //     for (int i = 1; i <= 15; i++) {
        //         String probName = difficulty + " " + i;
        //         diffMap.put(probName, createProblemData());
        //     }
        //     problemsMap.put(difficulty, diffMap);

        //     problems.put(warmUp, problemsMap);

        // // Save back to Firestore
        // Map<String, Object> update = new HashMap<>();
        // update.put("Problems", problems);
        //     studentRef.set(update, SetOptions.merge()).get();
        // }
    }

    public List<Map<String, Object>> getAssignedProblems(String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();
        List<Map<String, Object>> result = new ArrayList<>();
        if (doc.exists()) 
        {
            List<Map<String, Object>> assigned = (List<Map<String, Object>>) doc.get("Assigned Problems");
            
            if(assigned != null)
            {
                for(Map<String,Object> item: assigned)
                {
                    Map<String,Object> docPath = new HashMap<>(item);
                    // Object ref = docPath.get("problemRef");
                    // docPath.put("problemRef", ((DocumentReference)ref).getPath());
                    result.add(docPath);
                }
            }
        }
        return result;
    }

    public List<Map<String, Object>> getProblems(String topic, String difficulty) throws Exception
    {
        DocumentReference topicRef = firestore.collection("problems").document(topic);
        DocumentSnapshot topicDoc = topicRef.get().get();
        List<Map<String, Object>> result = new ArrayList<>();
        if(topicDoc.exists())
        {
            Map<String,Object> diffMap = (Map<String,Object>)topicDoc.get(difficulty);
            if(diffMap != null)
            {
                for(String prob: diffMap.keySet())
                {
                    Map<String,Object> details = (Map<String,Object>)diffMap.get(prob);
                    if(details != null)
                    {
                        Map<String,Object> info = new HashMap<>();
                        info.put("Name", details.get(prob));
                        info.put("Description", details.get("Description"));
                        result.add(info);
                    }
                }
            }
        }

        return result;
    }

    public List<Map<String, Object>> getStudents() throws Exception
    {
        List<Map<String, Object>> students = new ArrayList<>();
        for(DocumentSnapshot doc : firestore.collection("section").get().get().getDocuments())
        {
            Map<String, Object> data = doc.getData();
            
            if(data != null)
            {
                Map<String,Object> student = new HashMap<>();
                student.put("netId", doc.getId());
                student.put("name", data.get("Name"));
                student.put("progress", getCompletions(doc.getId()));
                students.add(student);
            }
        }

        return students;
    }

    public int getCompletions(String netId) throws Exception
    {
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            List<Map<String,Object>> assigned = (List<Map<String,Object>>) doc.get("Assigned Problems");
            if(assigned != null && !assigned.isEmpty())
            {
                int completed = 0;
                for(Map<String,Object> p : assigned)
                {
                    Object val = p.get("completed");
                    if(val != null && val.equals(Boolean.TRUE))
                    {
                        completed++;
                    }
                }

                return (int)Math.round((completed * 100.0) / assigned.size());
            }
        }

        return 0;
    }
    
    public Map<String,Object> getStudentDetails(String netId) throws Exception
    {
        Map<String, Object> result = new HashMap<>();
        DocumentReference docRef = firestore.collection("section").document(netId);
        DocumentSnapshot doc = docRef.get().get();

        if(doc.exists())
        {
            result.put("name",doc.getString("Name"));
            result.put("netId",netId);

            List<Map<String,Object>> assigned = (List<Map<String,Object>>)doc.get("Assigned Problems");
            int completed = 0;
            int total = 0;
            if(assigned != null)
            {
                total = assigned.size();
                for(Map<String,Object> p : assigned)
                {
                    if(Boolean.TRUE.equals(p.get("completed")))
                    {
                        completed++;
                    }
                }
            }
            int progress = 0;

            if(total > 0)
            {
                progress = (int) Math.round((completed * 100.0)/total);
            }

            result.put("progress",progress);
            result.put("completedProblems",completed);
            result.put("totalProblems",total);
            List<Map<String, Object>> rankings = getRankings(netId);
            List<Map<String, Object>> topTopics = new ArrayList<>();
            String[] textColors = {"text-green-300", "text-red-300", "text-blue-300", "text-yellow-300", "text-emerald-500"};
            String[] barColors = {"bg-green-300", "bg-red-300", "bg-blue-300", "bg-yellow-300", "bg-emerald-500"};
            
            for(int i = 0; i < Math.min(5,rankings.size()); i++)
            {
                Map<String,Object> topic = rankings.get(i);
                Map<String,Object> format = new HashMap<>();
                format.put("name",topic.get("topic"));
                format.put("percent",((Number)topic.get("strength")).intValue());
                format.put("textColor", textColors[i%textColors.length]);
                format.put("barColor", barColors[i%barColors.length]);
                topTopics.add(format);
            }
            result.put("topTopics",topTopics);

        }

        return result;
    }

    public void addStudent(String tempNetId, String userNetId, String newName, String email, String password, String role) throws Exception
    {
        DocumentReference tempRef = firestore.collection("section").document(tempNetId);
        DocumentSnapshot tempSnap = tempRef.get().get();
        if (!tempSnap.exists())
        {
            throw new Exception("Temp student not found");
        }

        DocumentSnapshot doc = firestore.collection("users").document(userNetId).get().get();
        if (doc.exists()) 
        {
           throw new Exception("Student already exists");
        }

        Map<String,Object> data = new HashMap<>(tempSnap.getData());
        data.put("Name", newName);
        data.put("Email", email);
        data.put("Password", password);
        data.put("Role", role);
        data.put("Assigned Problems", new ArrayList<>());
        firestore.collection("section").document(userNetId).set(data);
    }

    public void removeStudent(String netId) throws Exception
    {
        firestore.collection("section").document(netId).delete().get();
    }

    public void assignProblems(String netId, List<Map<String, Object>> problems) throws Exception
    {
        DocumentReference ref = firestore.collection("section").document(netId);
        Map<String,Object> updates = new HashMap<>();
        updates.put("Assigned Problems", problems);
        ref.update(updates).get();
    }

    public void assignProblemsAll(List<Map<String,Object>> problems) throws Exception
    {
        for(DocumentSnapshot student : firestore.collection("section").get().get().getDocuments())
        {
            String netId = student.getId();
            DocumentReference studentRef = firestore.collection("section").document(netId);
            Map<String,Object> updates = new HashMap<>();
            updates.put("Assigned Problems",problems);
            studentRef.update(updates).get();
        }
    }

    // public void saveUser(User user) throws Exception 
    // {
    //     firestore.collection("section").document(user.getEmail()).set(user).get();
    // }

    public User getUser(String email) throws Exception 
    {
        DocumentSnapshot doc = firestore.collection("section").document(email.substring(0,email.indexOf("@"))).get().get();
        if(doc.exists())
        {
            return new User(doc.getString("Name"), doc.getString("Email"), doc.getString("Password"), doc.getString("Role"));
        }
        return null;
    }
}
