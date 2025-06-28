package com.propertymanagement.service;

import com.propertymanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public int disableUser(Integer userId) {
        return userRepository.disableUserById(userId);
    }
}