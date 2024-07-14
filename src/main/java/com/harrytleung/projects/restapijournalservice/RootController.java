package com.harrytleung.projects.restapijournalservice;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.Arrays;
import java.util.Optional;

import org.springframework.hateoas.RepresentationModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harrytleung.projects.restapijournalservice.journal.JournalController;
import com.harrytleung.projects.restapijournalservice.page.PageController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class RootController {
    @GetMapping()
    public RepresentationModel<?> entry() {
        return new RepresentationModel<>(
            Arrays.asList(
                linkTo(methodOn(JournalController.class).allJournals(Optional.empty(), Optional.empty(), Optional.empty(), null)).withRel("all-journals"),
                linkTo(methodOn(PageController.class).allPages(null)).withRel("all-pages"),
                linkTo(methodOn(RootController.class).entry()).withSelfRel()
            ));
    }
}
