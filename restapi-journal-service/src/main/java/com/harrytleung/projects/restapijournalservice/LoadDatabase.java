package com.harrytleung.projects.restapijournalservice;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.harrytleung.projects.restapijournalservice.journal.Journal;
import com.harrytleung.projects.restapijournalservice.journal.JournalRepository;
import com.harrytleung.projects.restapijournalservice.page.Page;
import com.harrytleung.projects.restapijournalservice.page.PageRepository;

@Configuration
public class LoadDatabase {
    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);
    private static final int PRELOAD_JOURNAL_COUNT = 20;

    @Bean
    CommandLineRunner initDb(JournalRepository journalRepository, PageRepository pageRepository) {
        return args -> {
            journalRepository.deleteAll();
            pageRepository.deleteAll();

            journalRepository.saveAll(preloadJournals());
            pageRepository.saveAll(preloadPages());

            log.info(String.format("Preloaded %d journals", journalRepository.count()));
        };
    }

    private List<Journal> preloadJournals() {
        List<Journal> journals = new ArrayList<>();
        boolean locked = false;

        for (int i = 1; i <= PRELOAD_JOURNAL_COUNT; ++i) {
            journals.add(new Journal(Integer.toString(i), "Sample Journal " + i, locked));
            locked = !locked;
        }

        return journals;
    }

    private List<Page> preloadPages() {
        List<Page> pages = new ArrayList<>();
        String journalId;

        for (int i = 1; i <= PRELOAD_JOURNAL_COUNT; ++i) {
            journalId = Integer.toString(i);
            pages.add(new Page(journalId, "Sample Page 1", "Journal " + journalId + " page 1 content", LocalDateTime.now(), journalId));
        }

        return pages;
    }
}
