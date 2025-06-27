package com.propertymanagement;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        SecretKey secretKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        System.out.println("Generated Secret Key: " + encodedKey);
    }
}