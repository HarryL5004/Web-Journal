package com.harrytleung.projects.restapijournalservice.page;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.harrytleung.projects.restapijournalservice.RootController;
import com.harrytleung.projects.restapijournalservice.journal.JournalService;

@Component
public class PageModelAssembler implements RepresentationModelAssembler<Page, EntityModel<Page>>  {

    private final JournalService journalService;

    PageModelAssembler(JournalService journalService) {
        this.journalService = journalService;
    }

    @Override
    public EntityModel<Page> toModel(Page page) {
        List<Link> links = new ArrayList<>();
        if (!journalService.isJournalLocked(page.getJournalId())) {
            links.add(linkTo(methodOn(PageController.class).updatePage(null, null)).withRel("update"));
            links.add(linkTo(methodOn(PageController.class).deletePage(null)).withRel("delete"));
        }
        links.add(linkTo(methodOn(PageController.class).pageById(page.getId())).withSelfRel());

        return EntityModel.of(page, links);
    }

    public CollectionModel<EntityModel<Page>> toCollectionModelForAllPages(List<Page> pages) {
        return CollectionModel.of(
            pages.stream().map(this::toModel).collect(Collectors.toList()),
            linkTo(methodOn(PageController.class).allPages(null)).withSelfRel()
        );
    }

    public CollectionModel<EntityModel<Page>> toCollectionModelForAllPagesInJournal(String journalId, List<Page> pages) {
        List<Link> links = new ArrayList<>();
        if (!journalService.isJournalLocked(journalId))
            links.add(linkTo(methodOn(PageController.class).newPage(null)).withRel("new"));   

        links.add(linkTo(methodOn(PageController.class).allPagesInJournal(null)).withSelfRel());
        links.add(linkTo(methodOn(RootController.class).entry()).withRel("parent"));

        return CollectionModel.of(
            StreamSupport.stream(pages.spliterator(), false).map(this::toModel).collect(Collectors.toList()),
            links
        );
    }
    
}
