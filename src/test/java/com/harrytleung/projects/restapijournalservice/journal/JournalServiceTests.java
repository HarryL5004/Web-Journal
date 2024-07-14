package com.harrytleung.projects.restapijournalservice.journal;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

import com.harrytleung.projects.restapijournalservice.journal.Journal;
import com.harrytleung.projects.restapijournalservice.journal.JournalRepository;
import com.harrytleung.projects.restapijournalservice.journal.JournalService;

@SpringBootTest
public class JournalServiceTests {
    @Autowired
    JournalService journalService;

    @MockBean
    JournalRepository repositoryMock;

    @Test
    void testFindAll() {
        BDDMockito.given(repositoryMock.findAll()).willReturn(new ArrayList<>());
        Page<Journal> journals = journalService.findAll(null);
        assertThat(journals).isEmpty();
    }

}
