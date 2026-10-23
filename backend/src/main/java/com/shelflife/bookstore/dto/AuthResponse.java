package com.shelflife.bookstore.dto;

public record AuthResponse(String token, UserResponse user) {
}
