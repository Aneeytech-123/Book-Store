package com.shelflife.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.shelflife.bookstore.model.Book;
import com.shelflife.bookstore.service.AuthService;
import com.shelflife.bookstore.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService books;
    private final AuthService auth;

    public BookController(BookService books, AuthService auth) {
        this.books = books;
        this.auth = auth;
    }

    @GetMapping
    public List<Book> list(@RequestParam(required = false) String q,
                           @RequestParam(required = false) String genre,
                           @RequestParam(required = false, defaultValue = "title") String sort) {
        return books.search(q, genre, sort);
    }

    @GetMapping("/featured")
    public List<Book> featured() {
        return books.featured();
    }

    @GetMapping("/genres")
    public List<String> genres() {
        return books.genres();
    }

    @GetMapping("/{id}")
    public Book get(@PathVariable String id) {
        return books.get(id);
    }

    // Changes to the catalogue require a signed-in user

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book create(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                       @Valid @RequestBody Book book) {
        auth.requireUser(authorization);
        return books.create(book);
    }

    @PutMapping("/{id}")
    public Book update(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                       @PathVariable String id, @Valid @RequestBody Book book) {
        auth.requireUser(authorization);
        return books.update(id, book);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                       @PathVariable String id) {
        auth.requireUser(authorization);
        books.delete(id);
    }
}
