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
            pageRepository.deleteAll();

            int journalsToCreate = 20;
            for (int i = 1; i <= journalsToCreate; ++i) {
                String journalId = Integer.toString(i);
                String journalName = "Test Journal " + i;

                journalRepository.save(new Journal(journalId, journalName, false));
                pageRepository.save(new Page(Integer.toString(i), journalName + " Test Page 1", "Page 1 Content", LocalDateTime.now(), journalId));
            }
            journalRepository.save(new Journal("21", "Test Locked Journal 1", true));

            long journalCnt = journalRepository.count();
            log.info(String.format("Preloaded %d journals", journalCnt));

            pageRepository.save(new Page(Integer.toString(99), "Journal 1 Test Page 2", "Page 2 Content", LocalDateTime.now(), "1"));
        };
    }
}
