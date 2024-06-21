package com.harrytleung.projects.restapijournalservice.journal;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.harrytleung.projects.restapijournalservice.RootController;
import com.harrytleung.projects.restapijournalservice.page.PageController;

@Component
public class JournalModelAssembler implements RepresentationModelAssembler<Journal, EntityModel<Journal>> {

    @Override
    public EntityModel<Journal> toModel(Journal journal) {
        return EntityModel.of(
            journal,
            linkTo(methodOn(PageController.class).allPagesInJournal(journal.getId())).withRel("pages"),
            // linkTo(methodOn(PageController.class).deleteAllPagesInJournal(null)).withRel("delete-pages-in-journal"),
            linkTo(methodOn(JournalController.class).journalById(journal.getId())).withSelfRel(),
            linkTo(methodOn(RootController.class).entry()).withRel("root")
        );
    }

    public CollectionModel<EntityModel<Journal>> toCollectionModel(List<Journal> journals) {
        return CollectionModel.of(
            journals.stream().map(this::toModel).collect(Collectors.toList()),
            linkTo(methodOn(JournalController.class).newJournal(null)).withRel("new"),
            linkTo(methodOn(JournalController.class).journalById(null)).withRel(IanaLinkRelations.ITEM),
            linkTo(methodOn(JournalController.class).allJournals(Optional.empty())).withSelfRel(),
            linkTo(methodOn(RootController.class).entry()).withRel("root")
        );
    }
    
}
