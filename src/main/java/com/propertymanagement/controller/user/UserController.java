package com.propertymanagement.controller.user;


import com.propertymanagement.model.User;
import com.propertymanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.propertymanagement.service.UserService;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

   

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser) {
        if (updatedUser.getId() == null) {
            return ResponseEntity.badRequest().body("用户 ID 不能为空");
        }
        Optional<User> existingUser = userRepository.findById(updatedUser.getId());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (updatedUser.getUsername() != null) {
                user.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            user.setCreateTime(LocalDateTime.now());

            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/disable/{userId}")
    public ResponseEntity<?> disableUser(@PathVariable Integer userId) {
        int rowsAffected = userService.disableUser(userId);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("User disabled successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/enable/{userId}")
    public ResponseEntity<?> enableUser(@PathVariable Integer userId) {
        int rowsAffected = userService.enableUser(userId);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("User enabled successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        int rowsAffected = userService.deleteUser(userId);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}