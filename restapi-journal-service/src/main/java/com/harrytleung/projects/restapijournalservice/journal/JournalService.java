package com.harrytleung.projects.restapijournalservice.journal;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class JournalService {

    private final JournalRepository journalRepository;

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    public boolean isJournalLocked(String id) {
        return journalRepository.existsByLockedIsTrueAndIdIs(id);
    }

    Page<Journal> findAll(Pageable pageable) {
        return journalRepository.findAll(pageable);
    }

    Page<Journal> findByname(String name, Pageable pageable) {
        return journalRepository.findJournalsByNameLike(name, pageable);
    }

    Optional<Journal> findById(String id) {
        return journalRepository.findById(id);
    }

    Journal save(Journal journal) {
        return journalRepository.save(journal);
    }

    void deleteById(String id) {
        journalRepository.deleteById(id);
    }
}
