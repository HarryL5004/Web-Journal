package com.harrytleung.projects.restapijournalservice.journal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JournalRepository extends MongoRepository<Journal, String> {
    // @Query("{name:'?0'}")
    Page<Journal> findJournalsByNameLike(String name, Pageable pageable);

    boolean existsByLockedIsTrueAndIdIs(String id);
}
