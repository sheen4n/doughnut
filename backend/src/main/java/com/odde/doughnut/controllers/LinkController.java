package com.odde.doughnut.controllers;

import com.odde.doughnut.controllers.currentUser.CurrentUserFetcher;
import com.odde.doughnut.entities.LinkEntity;
import com.odde.doughnut.entities.NoteEntity;
import com.odde.doughnut.entities.NoteMotionEntity;
import com.odde.doughnut.exceptions.CyclicLinkDetectedException;
import com.odde.doughnut.exceptions.NoAccessRightException;
import com.odde.doughnut.models.NoteContentModel;
import com.odde.doughnut.models.TreeNodeModel;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.services.ModelFactoryService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/links")
public class LinkController {
    private final CurrentUserFetcher currentUserFetcher;
    private final ModelFactoryService modelFactoryService;

    public LinkController(CurrentUserFetcher currentUserFetcher, ModelFactoryService modelFactoryService) {
        this.currentUserFetcher = currentUserFetcher;
        this.modelFactoryService = modelFactoryService;
    }

    @GetMapping("/{noteEntity}/link")
    public String link( @PathVariable("noteEntity") NoteEntity noteEntity, @RequestParam(required = false) String searchTerm, Model model) {
        List<NoteEntity> linkableNotes = currentUserFetcher.getUser().filterLinkableNotes(noteEntity, searchTerm);
        model.addAttribute("linkableNotes", linkableNotes);
        return "links/new";
    }

    @PostMapping(value = "/{noteEntity}/link", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String linkNote(@PathVariable("noteEntity") NoteEntity noteEntity, Integer targetNoteId, Model model) throws NoAccessRightException {
        NoteEntity targetNote = modelFactoryService.noteRepository.findById(targetNoteId).get();
        LinkEntity linkEntity = new LinkEntity();
        linkEntity.setSourceNote(noteEntity);
        linkEntity.setTargetNote(targetNote);
        linkEntity.setType("belongs to");
        model.addAttribute("linkEntity", linkEntity);
        return "links/link_choose_type";
    }

    @PostMapping(value = "/create_link", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String linkNoteFinalize(@Valid LinkEntity linkEntity, BindingResult bindingResult) throws NoAccessRightException {
        if (bindingResult.hasErrors()) {
            return "links/link_choose_type";
        }
        currentUserFetcher.getUser().assertAuthorization(linkEntity.getSourceNote());
        modelFactoryService.linkRepository.save(linkEntity);
        return "redirect:/notes/" + linkEntity.getSourceNote().getId();
    }
}
