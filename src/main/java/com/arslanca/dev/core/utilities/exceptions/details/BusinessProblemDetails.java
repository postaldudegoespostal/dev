package com.arslanca.dev.core.utilities.exceptions.details;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusinessProblemDetails extends ProblemDetails {
    public BusinessProblemDetails() {
        setTitle("Business Rule Violation");
        setType("http://arslanca.com/exceptions/business");
        setStatus(400);
    }
}
