package com.quickkart.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.quickkart.entity.AppUser;
import com.quickkart.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository users;

    public CurrentUserService(UserRepository users) {
        this.users = users;
    }

    public AppUser get() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null) {
            throw new RuntimeException("Authentication required");
        
        }return users.findByEmailIgnoreCase(a.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
