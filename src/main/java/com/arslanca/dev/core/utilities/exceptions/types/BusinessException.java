package com.arslanca.dev.core.utilities.exceptions.types;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class BusinessException extends RuntimeException{

    public BusinessException(String message){
        super(message);
    }
}
