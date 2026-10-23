package com.shelflife.bookstore.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shelflife.bookstore.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByAuthToken(String authToken);
}
