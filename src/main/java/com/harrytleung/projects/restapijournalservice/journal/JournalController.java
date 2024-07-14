package com.harrytleung.projects.restapijournalservice.journal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


@RestController
@RequestMapping(path="/api/v1/journals", produces=MediaTypes.HAL_JSON_VALUE)
public class JournalController {
    private final JournalService journalService;
    private final JournalModelAssembler journalModelAssembler;
    private final PagedResourcesAssembler<Journal> pagedResourcesAssembler;

    JournalController(JournalService journalService, JournalModelAssembler assembler, PagedResourcesAssembler<Journal> pagedResourcesAssembler) {
        this.journalService = journalService;
        this.journalModelAssembler = assembler;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @GetMapping("/{id}")
    ResponseEntity<EntityModel<Journal>> journalById(@PathVariable("id") String id) {
        Journal journal = journalService.findById(id).orElseThrow(() -> new JournalNotFoundException(id));

        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.SECONDS))
            .body(journalModelAssembler.toModel(journal));
    }

    @GetMapping()
    public ResponseEntity<PagedModel<EntityModel<Journal>>> allJournals(@RequestParam("name") Optional<String> optionalName,
                                                                        @RequestParam("page") Optional<Integer> page,
                                                                        @RequestParam("size") Optional<Integer> size,
                                                                        @PageableDefault(value = 8) Pageable pageable) {
        Page<Journal> journals = optionalName.isPresent() && optionalName.get() != null ? 
            journalService.findByname(optionalName.get(), pageable) :
            journalService.findAll(pageable);


        return ResponseEntity
            .ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.SECONDS))
            .body(journalModelAssembler.addAdditionalRelLinks(pagedResourcesAssembler.toModel(journals, journalModelAssembler)));
    }

    @PostMapping()
    ResponseEntity<EntityModel<Journal>> newJournal(@RequestBody Journal journal) {
        EntityModel<Journal> journalEntity = journalModelAssembler.toModel(journalService.save(journal));
    
        return ResponseEntity
            .created(journalEntity.getRequiredLink(IanaLinkRelations.SELF).toUri())
            .cacheControl(CacheControl.noStore())
            .body(journalEntity); 
    }

    @PutMapping("/{id}")
    ResponseEntity<?> updateJournal(@PathVariable("id") String id, @RequestBody Journal newJournal) {
        Journal journal = journalService.findById(id)
            .map(oldJournal -> {
                oldJournal.setName(newJournal.getName());
                oldJournal.setLocked(newJournal.getLocked());
                return journalService.save(oldJournal);
            }).orElseGet(() -> {
                newJournal.setId(id);
                return journalService.save(newJournal);
            });

        EntityModel<Journal> journalEntity = journalModelAssembler.toModel(journal);

        return ResponseEntity
            .created(journalEntity.getRequiredLink(IanaLinkRelations.SELF).toUri())
            .cacheControl(CacheControl.noStore())
            .body(journalEntity);
    }
    
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteJournal(@PathVariable("id") String id) {
        // TODO: delete pages associated with journal
        journalService.deleteById(id);
        return ResponseEntity.noContent()
            .cacheControl(CacheControl.noStore())
            .build();
    }
}
