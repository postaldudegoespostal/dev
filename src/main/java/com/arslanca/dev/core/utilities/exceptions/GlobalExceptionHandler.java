package com.arslanca.dev.core.utilities.exceptions;

import com.arslanca.dev.core.utilities.exceptions.details.BusinessProblemDetails;
import com.arslanca.dev.core.utilities.exceptions.details.ProblemDetails;
import com.arslanca.dev.core.utilities.exceptions.details.ValidationProblemDetails;
import com.arslanca.dev.core.utilities.exceptions.types.BusinessException;
import com.arslanca.dev.core.utilities.exceptions.types.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BusinessProblemDetails handleBusinessException(BusinessException businessException) {
        log.warn("Business Exception: {}", businessException.getMessage());
        BusinessProblemDetails problemDetails = new BusinessProblemDetails();
        problemDetails.setDetail(businessException.getMessage());
        return problemDetails;
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetails handleNotFoundException(NotFoundException notFoundException) {
        log.warn("Not Found Exception: {}", notFoundException.getMessage());
        ProblemDetails problemDetails = new ProblemDetails();
        problemDetails.setTitle("Not Found");
        problemDetails.setDetail(notFoundException.getMessage());
        problemDetails.setType("http://arslanca.com/exceptions/not-found");
        problemDetails.setStatus(HttpStatus.NOT_FOUND.value());
        return problemDetails;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationProblemDetails handleValidationException(MethodArgumentNotValidException exception) {
        log.warn("Validation Failed: {}", exception.getMessage());
        ValidationProblemDetails validationProblemDetails = new ValidationProblemDetails();
        validationProblemDetails.setDetail("Validation failed");

        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        validationProblemDetails.setErrors(validationErrors);

        return validationProblemDetails;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetails handleGeneralException(Exception e) {
        log.error("An unexpected error occurred", e);
        ProblemDetails problemDetails = new ProblemDetails();
        problemDetails.setTitle("Internal Server Error");
        problemDetails.setDetail(e.getMessage());
        problemDetails.setType("http://arslanca.com/exceptions/internal");
        problemDetails.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return problemDetails;
    }
}