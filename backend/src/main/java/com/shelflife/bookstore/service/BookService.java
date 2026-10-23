package com.shelflife.bookstore.service;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.shelflife.bookstore.model.Book;
import com.shelflife.bookstore.repository.BookRepository;

@Service
public class BookService {

    private final BookRepository books;
    private final MongoTemplate mongo;

    public BookService(BookRepository books, MongoTemplate mongo) {
        this.books = books;
        this.mongo = mongo;
    }

    /**
     * Searches the catalogue.
     *
     * @param q     text matched against title and author (case-insensitive)
     * @param genre exact genre, or null / "All" for every genre
     * @param sort  one of: title, price-asc, price-desc, rating, newest
     */
    public List<Book> search(String q, String genre, String sort) {
        Query query = new Query();
        if (q != null && !q.isBlank()) {
            Pattern p = Pattern.compile(Pattern.quote(q.trim()), Pattern.CASE_INSENSITIVE);
            query.addCriteria(new Criteria().orOperator(Criteria.where("title").regex(p), Criteria.where("author").regex(p)));
        }
        if (genre != null && !genre.isBlank() && !genre.equalsIgnoreCase("All")) {
            query.addCriteria(Criteria.where("genre").is(genre));
        }
        query.with(sortFor(sort));
        return mongo.find(query, Book.class);
    }

    public List<Book> featured() {
        return books.findByFeaturedTrue();
    }

    public List<String> genres() {
        return mongo.findDistinct(new Query(), "genre", Book.class, String.class).stream().sorted().toList();
    }

    public Book get(String id) {
        return books.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
    }

    public Book create(Book book) {
        book.setId(null);
        return books.save(book);
    }

    public Book update(String id, Book changes) {
        get(id);
        changes.setId(id);
        return books.save(changes);
    }

    public void delete(String id) {
        if (!books.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        books.deleteById(id);
    }

    private static Sort sortFor(String sort) {
        if (sort == null) return Sort.by("title");
        return switch (sort) {
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "newest" -> Sort.by(Sort.Direction.DESC, "year");
            default -> Sort.by("title");
        };
    }
}
