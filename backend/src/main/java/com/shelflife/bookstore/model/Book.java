package com.shelflife.bookstore.model;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** A book in the catalogue, stored in the "books" collection. */
@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @NotBlank @Size(max = 120)
    private String title;

    @NotBlank @Size(max = 80)
    private String author;

    @NotBlank @Size(max = 40)
    @Indexed
    private String genre;

    @NotNull @DecimalMin("0.0") @DecimalMax("100000.0")
    private BigDecimal price;

    @DecimalMin("0.0") @DecimalMax("5.0")
    private double rating;

    @Size(max = 1000)
    private String description;

    @Min(1) @Max(10000)
    private int pages;

    @Min(0) @Max(2100)
    private int year;

    @Min(0)
    private int stock;

    /** Hex colour used to draw the generated cover, e.g. #1f3a5f */
    @Pattern(regexp = "^#[0-9a-fA-F]{6}$")
    private String coverColor;

    private boolean featured;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCoverColor() { return coverColor; }
    public void setCoverColor(String coverColor) { this.coverColor = coverColor; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
