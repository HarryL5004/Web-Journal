package com.harrytleung.projects.restapijournalservice.page;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class PageService {
    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public void deleteAllByJournalId(String journalId) {
        pageRepository.deleteAllByJournalId(journalId);
    }

    List<Page> findAll() {
        return pageRepository.findAll();
    }

    List<Page> findAllByJournalId(String journalId) {
        return pageRepository.findPagesByJournalId(journalId).orElse(new ArrayList<>());
    }

    Page findById(String id) {
        return pageRepository.findById(id).orElseThrow(() -> new PageNotFoundException(id));
    }

    List<Page> findByTitle(String title) {
        return pageRepository.findPagesByTitleLike(title).orElse(new ArrayList<>());
    }

    Page save(Page newPage) {
        return pageRepository.save(newPage);
    }

    Page update(String pageId, Page newPage) {
        Page page = newPage;
        try {
            page = findById(pageId);
            page.setId(newPage.getId());
            page.setTitle(newPage.getTitle());
            page.setContent(newPage.getContent());
            page.setLastUpdatedTime(LocalDateTime.now());
            page.setJournalId(newPage.getJournalId());
        } catch (PageNotFoundException ex) {
            page.setId(pageId);
        }

        return save(page);
    }

    void deleteById(String id) {
        pageRepository.deleteById(id);
    }
}
