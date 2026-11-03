package com.quickkart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record RegisterRequest(@NotBlank
            @Size(min = 2, max = 100) String name, @NotBlank
            @Email String email, @NotBlank
            @Pattern(regexp = "^[0-9]{10}$") String phone, @NotBlank
            @Size(min = 8, max = 72) String password) {}

    public record LoginRequest(@NotBlank
            @Email String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, String role) {}
}
