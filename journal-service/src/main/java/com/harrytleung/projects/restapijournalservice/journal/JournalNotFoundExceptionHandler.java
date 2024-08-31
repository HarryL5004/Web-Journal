package com.harrytleung.projects.restapijournalservice.journal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class JournalNotFoundExceptionHandler {
    @ResponseBody
    @ExceptionHandler(JournalNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String journalNotFoundHandler(JournalNotFoundException ex) {
        return ex.getMessage();
    }
}
