package com.arslanca.dev.core.utilities.exceptions.details;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ProblemDetails {
    private String title;
    private String detail;
    private int status;
    private String type;
    private LocalDateTime timestamp = LocalDateTime.now();
}
