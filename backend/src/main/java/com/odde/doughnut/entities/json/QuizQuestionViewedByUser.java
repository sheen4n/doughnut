package com.odde.doughnut.entities.json;

import com.odde.doughnut.entities.Link;
import com.odde.doughnut.entities.Note;
import com.odde.doughnut.entities.QuizQuestion;
import com.odde.doughnut.entities.repositories.NoteRepository;
import com.odde.doughnut.models.NoteViewer;
import com.odde.doughnut.models.quizFacotries.QuizQuestionPresenter;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public class QuizQuestionViewedByUser {

    public QuizQuestion quizQuestion;

    @Getter
    public QuizQuestion.QuestionType questionType;

    @Getter
    public String description;

    @Getter
    public String mainTopic;

    @Getter
    public Map<Link.LinkType, LinkViewed> hintLinks;

    @Getter
    public List<Integer> viceReviewPointIdList;

    public List<Note> scope;

    @Getter
    public List<Option> options;

    public static Optional<QuizQuestionViewedByUser> from(QuizQuestion quizQuestion, NoteRepository noteRepository) {
        if(quizQuestion == null) return Optional.empty();
        QuizQuestionPresenter presenter = quizQuestion.getQuestionType().presenter.apply(quizQuestion);
        QuizQuestionViewedByUser question = new QuizQuestionViewedByUser();
        question.quizQuestion = quizQuestion;
        question.questionType = quizQuestion.getQuestionType();
        question.description = presenter.instruction();
        question.mainTopic = presenter.mainTopic();
        question.hintLinks = presenter.hintLinks();
        question.viceReviewPointIdList = quizQuestion.getViceReviewPointIdList();
        question.scope = List.of(quizQuestion.getReviewPoint().getSourceNote().getNotebook().getHeadNote());
        QuizQuestionViewedByUser.OptionCreator optionCreator = presenter.optionCreator();
        Stream<Integer> ids = Arrays.stream(quizQuestion.getOptionNoteIds().split(",")).map(Integer::valueOf);
        Stream<Note> noteStream = ids.map(noteRepository::findById).filter(Optional::isPresent).map(Optional::get);
        question.options = noteStream.map(optionCreator::optionFromNote).toList();
        return Optional.of(question);
    }

    public static class Option {
        @Getter
        private NoteSphere note;
        @Getter
        private boolean isPicture = false;

        private Option() {
        }

        public static Option createTitleOption(Note note) {
            Option option = new Option();
            option.note = new NoteViewer(null, note).toJsonObject();
            return option;
        }

        public static Option createPictureOption(Note note) {
            Option option = new Option();
            option.note = new NoteViewer(null, note).toJsonObject();
            option.isPicture = true;
            return option;
        }

        public String getDisplay() {
            return note.getNote().getTitle();
        }
    }

    public interface OptionCreator {
        Option optionFromNote(Note note);
    }

    public static class TitleOptionCreator implements OptionCreator {
        @Override
        public Option optionFromNote(Note note) {
            return Option.createTitleOption(note);
        }
    }

    public static class PictureOptionCreator implements OptionCreator {
        @Override
        public Option optionFromNote(Note note) {
            return Option.createPictureOption(note);
        }
    }
}