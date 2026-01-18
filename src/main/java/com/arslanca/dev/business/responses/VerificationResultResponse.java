package com.arslanca.dev.business.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerificationResultResponse {
    private boolean success;
    private String userLevel;
    private String message;
    private String redirectPath;
}