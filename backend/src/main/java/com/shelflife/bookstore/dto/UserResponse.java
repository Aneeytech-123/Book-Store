package com.shelflife.bookstore.dto;

import java.time.Instant;

import com.shelflife.bookstore.model.User;

/** Public view of a user; never includes the password hash or token. */
public record UserResponse(String id, String fullName, String email, String phone, Instant createdAt) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getCreatedAt());
    }
}
