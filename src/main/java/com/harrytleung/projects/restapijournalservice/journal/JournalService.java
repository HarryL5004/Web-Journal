package com.harrytleung.projects.restapijournalservice.journal;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class JournalService {

    private final JournalRepository journalRepository;

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    List<Journal> findAll() {
        return journalRepository.findAll();
    }

    Optional<Journal> findById(String id) {
        return journalRepository.findById(id);
    }

    List<Journal> findByname(String name) {
        return journalRepository.findJournalsByNameLike(name);
    }

    Journal save(Journal journal) {
        return journalRepository.save(journal);
    }

    void deleteById(String id) {
        journalRepository.deleteById(id);
    }
}
