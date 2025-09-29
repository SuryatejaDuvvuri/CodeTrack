package com.CS010B._bbackend.model;

import com.google.cloud.firestore.annotation.PropertyName;

public class User 
{
    @PropertyName("Email")
    private String email;
    @PropertyName("Password")
    private String password;
    private String role;
    private String name;

    public User(String name, String email, String password, String role) 
    {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    public String getName() 
    {
        return name;
    }
    public void setName(String name) 
    {
        this.name = name;
    }
    @PropertyName("Email")
    public String getEmail() 
    {
        return email;
    }
    @PropertyName("Email")
    public void setEmail(String email) 
    {
        this.email = email;
    }
    @PropertyName("Password")
    public String getPassword() 
    {
        return password;
    }
    @PropertyName("Password")
    public void setPassword(String password) 
    {
        this.password = password;
    }
    public String getRole() 
    {
        return role;
    }
    public void setRole(String role) 
    {
        this.role = role;
    }    
}
