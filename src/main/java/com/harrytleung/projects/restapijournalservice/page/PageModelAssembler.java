package com.harrytleung.projects.restapijournalservice.page;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.harrytleung.projects.restapijournalservice.RootController;

@Component
public class PageModelAssembler implements RepresentationModelAssembler<Page, EntityModel<Page>>  {

    @Override
    public EntityModel<Page> toModel(Page page) {
        return EntityModel.of(
            page,
            linkTo(methodOn(PageController.class).updatePage(null, null)).withRel("update"),
            linkTo(methodOn(PageController.class).deletePage(null)).withRel("delete"),
            linkTo(methodOn(PageController.class).pageById(page.getId())).withSelfRel()
        );
    }

    public CollectionModel<EntityModel<Page>> toCollectionModelForAllPages(List<Page> pages) {
        return CollectionModel.of(
            pages.stream().map(this::toModel).collect(Collectors.toList()),
            linkTo(methodOn(PageController.class).allPages(null)).withSelfRel()
        );
    }

    public CollectionModel<EntityModel<Page>> toCollectionModelForAllPagesInJournal(List<Page> pages) {
        // todo: return list of summarized pages
        return CollectionModel.of(
            StreamSupport.stream(pages.spliterator(), false).map(this::toModel).collect(Collectors.toList()),
            linkTo(methodOn(PageController.class).newPage(null)).withRel("new"),
            linkTo(methodOn(PageController.class).allPagesInJournal(null)).withSelfRel(),
            linkTo(methodOn(RootController.class).entry()).withRel("parent")
        );
    }
    
}
