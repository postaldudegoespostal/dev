package com.arslanca.dev.business.dto.requests;

import lombok.Data;

@Data
public class CreateTechStackRequest {
    private String name;
    private String type;
}
