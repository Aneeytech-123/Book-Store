package com.shelflife.bookstore.dto;

import java.time.Instant;
import java.util.Map;

/** Error body returned by every failed request. */
public record ApiError(int status, String message, Map<String, String> fieldErrors, Instant timestamp) {

    public static ApiError of(int status, String message) {
        return new ApiError(status, message, Map.of(), Instant.now());
    }
}
