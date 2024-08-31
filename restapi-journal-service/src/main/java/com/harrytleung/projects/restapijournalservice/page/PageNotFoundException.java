package com.harrytleung.projects.restapijournalservice.page;

public class PageNotFoundException extends RuntimeException {
    PageNotFoundException(String id) {
        super(String.format("Could not find page with id: %s", id));
    }
}
