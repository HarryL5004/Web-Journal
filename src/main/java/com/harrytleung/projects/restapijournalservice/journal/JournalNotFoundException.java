package com.harrytleung.projects.restapijournalservice.journal;

public class JournalNotFoundException extends RuntimeException {
    public JournalNotFoundException(String id) {
        super(String.format("Could not find journal with id: %s", id));
    }
}
