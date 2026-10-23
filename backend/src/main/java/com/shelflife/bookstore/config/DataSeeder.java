package com.shelflife.bookstore.config;

import java.io.InputStream;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shelflife.bookstore.model.Book;
import com.shelflife.bookstore.repository.BookRepository;

/** Loads the starter catalogue from books.json the first time the app runs. */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final BookRepository books;
    private final ObjectMapper mapper;

    public DataSeeder(BookRepository books, ObjectMapper mapper) {
        this.books = books;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (books.count() > 0) return;
        try (InputStream in = new ClassPathResource("books.json").getInputStream()) {
            List<Book> seed = mapper.readValue(in, new TypeReference<List<Book>>() {});
            books.saveAll(seed);
            log.info("Seeded {} books into MongoDB", seed.size());
        }
    }
}
