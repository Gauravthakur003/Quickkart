package com.quickkart.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, unique = true, length = 160)
    private String email;
    @Column(nullable = false, length = 15)
    private String phone;
    @Column(nullable = false)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.CUSTOMER;
    @Column(nullable = false)
    private boolean active = true;
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String v) {
        name = v;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String v) {
        email = v;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String v) {
        phone = v;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String v) {
        passwordHash = v;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role v) {
        role = v;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean v) {
        active = v;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
