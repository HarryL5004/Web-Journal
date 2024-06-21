package com.harrytleung.projects.restapijournalservice.journal;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface JournalRepository extends MongoRepository<Journal, String> {
    // @Query("{name:'?0'}")
    List<Journal> findJournalsByNameLike(String name);
}
