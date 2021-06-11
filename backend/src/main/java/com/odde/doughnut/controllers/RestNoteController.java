
package com.odde.doughnut.controllers;

import com.odde.doughnut.controllers.currentUser.CurrentUserFetcher;
import com.odde.doughnut.entities.Note;
import com.odde.doughnut.entities.ReviewPoint;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.UserModel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
class RestNoteController {
  private final ModelFactoryService modelFactoryService;
  private final CurrentUserFetcher currentUserFetcher;

  public RestNoteController(ModelFactoryService modelFactoryService, CurrentUserFetcher currentUserFetcher) {
    this.modelFactoryService = modelFactoryService;
    this.currentUserFetcher = currentUserFetcher;
  }

  class NoteStatistics {
    @Getter
    @Setter
    private Integer repetitionCount = null;

  }

  @GetMapping("/{note}/statistics")
  public NoteStatistics statistics(@PathVariable("note") Note note) {
    final UserModel user = currentUserFetcher.getUser();
    NoteStatistics statistics = new NoteStatistics();
    final ReviewPoint reviewPoint = user.getReviewPointFor(note);
    if (reviewPoint != null) {
      statistics.setRepetitionCount(reviewPoint.getRepetitionCount());
    }
    statistics.setRepetitionCount(2);
    return statistics;
  }
}
