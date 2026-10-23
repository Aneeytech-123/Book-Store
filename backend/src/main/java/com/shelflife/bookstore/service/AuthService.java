package com.shelflife.bookstore.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.shelflife.bookstore.dto.AuthResponse;
import com.shelflife.bookstore.dto.LoginRequest;
import com.shelflife.bookstore.dto.RegisterRequest;
import com.shelflife.bookstore.dto.UserResponse;
import com.shelflife.bookstore.model.User;
import com.shelflife.bookstore.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();
    private final Duration tokenLifetime;

    public AuthService(UserRepository users, @Value("${app.auth.token-hours:24}") long tokenHours) {
        this.users = users;
        this.tokenLifetime = Duration.ofHours(tokenHours);
    }

    /** Creates an account and signs the user in. */
    public AuthResponse register(RegisterRequest req) {
        String email = normaliseEmail(req.email());
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setPhone(req.phone() == null || req.phone().isBlank() ? null : req.phone().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        try {
            return issueToken(user);
        } catch (DuplicateKeyException e) {
            // Two sign-ups with the same email at the same moment
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
    }

    public AuthResponse login(LoginRequest req) {
        User user = users.findByEmail(normaliseEmail(req.email()))
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password"));
        return issueToken(user);
    }

    /** Returns the signed-in user for an "Authorization: Bearer <token>" header. */
    public User requireUser(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in");
        }
        return users.findByAuthToken(token)
                .filter(u -> u.getTokenExpiresAt() != null && u.getTokenExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your session has expired, please log in again"));
    }

    public void logout(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        if (token == null) return;
        users.findByAuthToken(token).ifPresent(u -> {
            u.setAuthToken(null);
            u.setTokenExpiresAt(null);
            users.save(u);
        });
    }

    private AuthResponse issueToken(User user) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        user.setAuthToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
        user.setTokenExpiresAt(Instant.now().plus(tokenLifetime));
        User saved = users.save(user);
        return new AuthResponse(saved.getAuthToken(), UserResponse.from(saved));
    }

    private static String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) return null;
        String token = header.substring(7).trim();
        return token.isEmpty() ? null : token;
    }

    private static String normaliseEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
