package com.shelflife.bookstore.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shelflife.bookstore.model.Book;

public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByFeaturedTrue();
}
