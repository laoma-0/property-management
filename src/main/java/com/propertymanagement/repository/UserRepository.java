package com.propertymanagement.repository;

import com.propertymanagement.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
     //禁用用户
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = 0 WHERE u.id = :userId")
    int disableUserById(Integer userId);
}