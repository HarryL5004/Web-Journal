package com.harrytleung.projects.restapijournalservice.page;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="/api/v1/", produces=MediaTypes.HAL_JSON_VALUE)
public class PageController {
    private final PageService pageService;
    private final PageModelAssembler pageModelAssembler;


    PageController(PageService pageService, PageModelAssembler pageModelAssembler) {
        this.pageService = pageService;
        this.pageModelAssembler = pageModelAssembler;
    }

    @GetMapping("/pages")
    public ResponseEntity<CollectionModel<EntityModel<Page>>> allPages(@RequestParam(value = "title", defaultValue = "") String title) {
        List<Page> pages = title.isEmpty() ? pageService.findAll() : pageService.findByTitle(title);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(pageModelAssembler.toCollectionModelForAllPages(pages));
    }

    @GetMapping("/journals/{journalId}/pages/{id}")
    public EntityModel<Page> pageById(@PathVariable("id") String pageId) {
        return pageModelAssembler.toModel(pageService.findById(pageId));
    }

    @PostMapping("/journals/{journalId}/pages")
    public ResponseEntity<?> newPage(@RequestBody Page page) {
        page.setLastUpdatedTime(LocalDateTime.now());
        EntityModel<Page> entityModel = pageModelAssembler.toModel(pageService.save(page));

        return ResponseEntity
            .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
            .body(entityModel);
    }

    @PatchMapping("/journals/{journalId}/pages/{id}")
    ResponseEntity<?> updatePage(@PathVariable("id") String pageId, @RequestBody Page newPage) {
        EntityModel<Page> entityModel = pageModelAssembler.toModel(pageService.update(pageId, newPage));

        return ResponseEntity
            .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
            .body(entityModel);
    }

    @DeleteMapping("/journals/{journalId}/pages/{id}")
    public ResponseEntity<?> deletePage(@PathVariable("id") String id) {
        pageService.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/journals/{journalId}/pages")
    public ResponseEntity<CollectionModel<EntityModel<Page>>> allPagesInJournal(@PathVariable("journalId") String journalId) {
        List<Page> pages = pageService.findAllByJournalId(journalId);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(pageModelAssembler.toCollectionModelForAllPagesInJournal(journalId, pages));
    }

    @DeleteMapping("/journals/{journalId}/pages")
    public ResponseEntity<?> deleteAllPagesInJournal(@PathVariable("journalId") String journalId) {
        pageService.deleteAllByJournalId(journalId);

        return ResponseEntity.noContent().build();
    }

    @ResponseBody
    @ExceptionHandler(PageNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String pageNotFoundHandler(PageNotFoundException ex) {
        return ex.getMessage();
    }

}
