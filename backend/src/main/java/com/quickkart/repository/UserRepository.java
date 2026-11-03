package com.quickkart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickkart.entity.AppUser;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
