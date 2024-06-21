package com.harrytleung.projects.restapijournalservice.journal;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.MediaTypes;
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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/api/v1/journals", produces=MediaTypes.HAL_JSON_VALUE)
public class JournalController {
    private final JournalService journalService;
    private final JournalModelAssembler journalModelAssembler;

    JournalController(JournalService journalService, JournalModelAssembler assembler) {
        this.journalService = journalService;
        this.journalModelAssembler = assembler;
    }

    @GetMapping("/{id}")
    ResponseEntity<EntityModel<Journal>> journalById(@PathVariable("id") String id) {
        Journal journal = journalService.findById(id).orElseThrow(() -> new JournalNotFoundException(id));

        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(10, TimeUnit.SECONDS))
            .body(journalModelAssembler.toModel(journal));
    }

    @GetMapping()
    public ResponseEntity<CollectionModel<EntityModel<Journal>>> allJournals(@RequestParam("name") Optional<String> optionalName) {
        List<Journal> journals = optionalName.isPresent() && optionalName.get() != null ? 
            journalService.findByname(optionalName.get()) :
            journalService.findAll();

        return ResponseEntity
            .ok()
            .cacheControl(CacheControl.maxAge(10, TimeUnit.SECONDS))
            .body(journalModelAssembler.toCollectionModel(journals));
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
        journalService.deleteById(id);
        return ResponseEntity.noContent()
            .cacheControl(CacheControl.noStore())
            .build();
    }
}
