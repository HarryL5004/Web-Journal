package com.harrytleung.projects.restapijournalservice;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.bson.BsonDateTime;
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

    @Bean
    CommandLineRunner initDb(JournalRepository journalRepository, PageRepository pageRepository) {
        return args -> {
            journalRepository.deleteAll();
            journalRepository.save(new Journal("1", "Test Journal 1"));
            journalRepository.save(new Journal("2", "Test Journal 2"));

            journalRepository.findAll().forEach(journal -> log.info("Preloaded journal: " + journal.getName()));
            journalRepository.findById("1").ifPresent(journal -> log.info("Test finding journal using id: " + journal.getName()));

            pageRepository.deleteAll();
            pageRepository.save(new Page("1", "Journal 1 Test Page 1", "Page 1 Content", LocalDateTime.now(), "1"));
            pageRepository.save(new Page("2", "Journal 1 Test Page 2", "Page 2 Content", LocalDateTime.now(), "1"));
            pageRepository.save(new Page("3", "Journal 2 Test Page 2", "Page 1 Content", LocalDateTime.now(), "2"));

            pageRepository.findAll().forEach(page -> log.info("Preloaded page with content: " + page.getContent()));
        };
    }
}
