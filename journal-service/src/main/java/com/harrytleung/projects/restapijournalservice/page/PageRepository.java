package com.harrytleung.projects.restapijournalservice.page;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PageRepository extends MongoRepository<Page, String> {
    Optional<List<Page>> findPagesByTitleLike(String title);

    Optional<List<Page>> findPagesByJournalId(String journalId);

    void deleteAllByJournalId(String journalId);
}
