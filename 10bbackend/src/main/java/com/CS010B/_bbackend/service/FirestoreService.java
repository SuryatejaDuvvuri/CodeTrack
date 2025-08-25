package com.CS010B._bbackend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService 
{
    private Firestore firestore;

    public void initFirestore() throws IOException
    {
        InputStream account = getClass().getResourceAsStream("/firebase-service-account.json");
        
        FirebaseOptions options = FirebaseOptions.builder().setCredentials(GoogleCredentials.fromStream(account)).build();

        if(FirebaseApp.getApps().isEmpty())
        {
            FirebaseApp.initializeApp(options);
        }

        this.firestore = FirestoreClient.getFirestore();
    }

    public Map<String,Object> getProblem(String id) throws ExecutionException, InterruptedException
    {
        DocumentReference docRef = firestore.collection("problems").document().
        DocumentSnapshot doc = docRef.get().get();
    }
}
