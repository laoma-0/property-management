package com.propertymanagement.model;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String phone;
    private String email;
    private String role;
}