package com.arslanca.dev.core.utilities.results;

import java.time.LocalDateTime;

public record ErrorResult(
        String message,
        String details,
        LocalDateTime timestamp) {}
