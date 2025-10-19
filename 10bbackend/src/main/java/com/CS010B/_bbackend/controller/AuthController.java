package com.CS010B._bbackend.controller;

import java.util.Map;

import com.CS010B._bbackend.model.JwtUtil;
import com.CS010B._bbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS010B._bbackend.service.FirestoreService;
import com.google.rpc.context.AttributeContext.Response;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://code-track-eight.vercel.app", allowCredentials = "true")
public class AuthController 
{
    @Autowired
    private FirestoreService firestore;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String,String> req) throws Exception
    {
       String email = req.get("Email");
       String password = req.get("Password");
       String name = req.get("Name");
       
       if(!email.endsWith("@ucr.edu"))
       {
            return ResponseEntity.badRequest().body("Email must end with @ucr.edu");
       }

       firestore.addStudent("sduvv003",email.substring(0,email.indexOf("@")), name, email,password,"STUDENT");
       return ResponseEntity.ok("Signup success!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> req) throws Exception
    {
         String email = req.get("Email");
         String password = req.get("Password");
         User user = firestore.getUser(email);

         if(user == null || user.getPassword() == null || !user.getPassword().equals(password))
         {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
         }

         String token = JwtUtil.generateToken(email, user.getRole());
         return ResponseEntity.ok(Map.of("token",token,"role",user.getRole(), "name", user.getName()));

    } 
}
