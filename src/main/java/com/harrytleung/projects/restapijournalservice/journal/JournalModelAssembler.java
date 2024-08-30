package com.harrytleung.projects.restapijournalservice.journal;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.harrytleung.projects.restapijournalservice.RootController;
import com.harrytleung.projects.restapijournalservice.page.PageController;

@Component
public class JournalModelAssembler implements RepresentationModelAssembler<Journal, EntityModel<Journal>> {

    @Override
    public EntityModel<Journal> toModel(Journal journal) {       
        List<Link> links = new ArrayList<>();

        links.add(linkTo(methodOn(PageController.class).allPagesInJournal(journal.getId())).withRel("pages"));
        links.add(linkTo(methodOn(JournalController.class).updateJournal(journal.getId(), null)).withRel("update"));
        if (!journal.getLocked())
            links.add(linkTo(methodOn(JournalController.class).deleteJournal(journal.getId())).withRel("delete"));

        links.add(linkTo(methodOn(JournalController.class).journalById(journal.getId())).withSelfRel());
        links.add(linkTo(methodOn(JournalController.class).allJournals(Optional.empty(), Optional.empty(), Optional.empty(), null)).withRel("parent"));

        return EntityModel.of(journal, links);
    }

    public PagedModel<EntityModel<Journal>> addAdditionalRelLinks(PagedModel<EntityModel<Journal>> pagedModel) {
        pagedModel.add(linkTo(methodOn(JournalController.class).newJournal(null)).withRel("new"));
        pagedModel.add(linkTo(methodOn(JournalController.class).journalById(null)).withRel(IanaLinkRelations.ITEM));
        pagedModel.add(linkTo(methodOn(JournalController.class).allJournals(Optional.empty(), Optional.empty(), Optional.empty(), null)).withRel("search"));
        pagedModel.add(linkTo(methodOn(RootController.class).entry()).withRel("parent"));
        return pagedModel;
    }
    
}
