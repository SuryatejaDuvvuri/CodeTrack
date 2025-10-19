package com.CS010B._bbackend.model;
import io.jsonwebtoken.*;
import java.util.Date;

public class JwtUtil 
{
    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY");

    public static String generateToken(String email, String role) {
        return Jwts.builder()
            .setSubject(email)
            .claim("Role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
    }

    public static Claims validateToken(String token) 
    {
        return Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();
    }
}