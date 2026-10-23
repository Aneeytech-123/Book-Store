package com.shelflife.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 60, message = "Full name must be 2 to 60 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 100)
        String email,

        @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone number must be 10 digits")
        String phone,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 64, message = "Password must be 8 to 64 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*[0-9]).+$", message = "Password must contain a letter and a number")
        String password) {
}
