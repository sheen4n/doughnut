/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.35.1025 on 2022-03-21 18:28:50.

declare namespace Generated {

    interface CircleForUserView {
        id: number;
        name: string;
        invitationCode: string;
        notebooks: NotebooksViewedByUser;
        members: UserForOtherUserView[];
    }

    interface CircleJoiningByInvitation {
        invitationCode: string;
    }

    interface CurrentUserInfo {
        user: User;
        externalIdentifier: string;
    }

    interface DummyForGeneratingTypes {
        answerResult: AnswerResult;
        reviewing: Reviewing;
    }

    interface InitialInfo {
        reviewPoint: ReviewPoint;
        reviewSetting: ReviewSetting;
    }

    interface LinkRequest {
        typeId: number;
        moveUnder: boolean;
        asFirstChild: boolean;
    }

    interface LinkViewed {
        direct: Link[];
        reverse: Link[];
    }

    interface LinkViewedByUser {
        id: number;
        sourceNoteWithPosition: NoteWithPosition;
        linkTypeLabel: string;
        typeId: number;
        targetNoteWithPosition: NoteWithPosition;
        readonly: boolean;
    }

    interface NoteCreation {
        linkTypeToParent: number;
        textContent: TextContent;
    }

    interface NotePositionViewedByUser {
        noteId: number;
        notebook: NotebookViewedByUser;
        ancestors: Note[];
    }

    interface NoteSphere {
        id: number;
        links?: { [P in LinkType]?: LinkViewed };
        childrenIds?: number[];
        note: Note;
    }

    interface NoteWithPosition {
        notePosition: NotePositionViewedByUser;
        note: NoteSphere;
    }

    interface NotebookViewedByUser {
        id: number;
        headNoteId: number;
        headNote: Note;
        skipReviewEntirely: boolean;
        fromBazaar: boolean;
        ownership: Ownership;
    }

    interface NotebooksViewedByUser {
        notebooks: NotebookViewedByUser[];
        subscriptions: Subscription[];
    }

    interface NotesBulk {
        notePosition: NotePositionViewedByUser;
        notes: NoteSphere[];
    }

    interface RedirectToNoteResponse {
        noteId: number;
    }

    interface RepetitionForUser {
        reviewPointViewedByUser: ReviewPointViewedByUser;
        quizQuestion?: QuizQuestion;
        emptyAnswer: Answer;
        toRepeatCount: number;
    }

    interface ReviewPointViewedByUser {
        reviewPoint: ReviewPoint;
        noteWithPosition?: NoteWithPosition;
        linkViewedByUser?: LinkViewedByUser;
        reviewSetting: ReviewSetting;
        remainingInitialReviewCountForToday: number;
    }

    interface SearchTerm {
        allMyNotebooksAndSubscriptions: boolean;
        allMyCircles: boolean;
        note?: number;
        searchKey: string;
    }

    interface SelfEvaluation {
        selfEvaluation: string;
        increaseRepeatCount: boolean;
    }

    interface UserForOtherUserView {
        name: string;
    }

    interface User {
        id: number;
        name: string;
        externalIdentifier: string;
        ownership: Ownership;
        dailyNewNotesCount: number;
        spaceIntervals: string;
    }

    interface AnswerResult {
        answer: string;
        answerNote: Note;
        questionType: QuestionType;
        answerDisplay: string;
        correct: boolean;
    }

    interface Reviewing {
        toRepeatCount: number;
        remainingDailyNewNotesCount: number;
        learntCount: number;
        notLearntCount: number;
    }

    interface ReviewPoint {
        id: number;
        lastReviewedAt: string;
        nextReviewAt: string;
        initialReviewedAt: string;
        repetitionCount: number;
        forgettingCurveIndex: number;
        removedFromReview: boolean;
        noteId: number;
        linkId: number;
    }

    interface ReviewSetting {
        id: number;
        rememberSpelling: boolean;
        level: number;
    }

    interface Link {
        id: number;
        sourceNote: Note;
        targetNote: Note;
        typeId: number;
        createdAt: string;
        linkTypeLabel: string;
        linkNameOfSource: string;
    }

    interface TextContent {
        title: string;
        description: string;
        updatedAt: string;
    }

    interface Note {
        id: number;
        noteAccessories: NoteAccessories;
        textContent: TextContent;
        createdAt: string;
        notePicture?: string;
        parentId?: number;
        shortDescription: string;
        title: string;
    }

    interface Ownership {
        id: number;
        circle?: Circle;
    }

    interface Subscription {
        id: number;
        dailyTargetOfNewNotes: number;
        user: User;
        notebook: Notebook;
        headNote: Note;
        shortDescription: string;
        title: string;
    }

    interface QuizQuestion {
        questionType: QuestionType;
        options: Option[];
        description: string;
        mainTopic: string;
        hintLinks: { [P in LinkType]?: LinkViewed };
        viceReviewPointIds: number[];
        scope: Note[];
    }

    interface Answer {
        answer: string;
        answerNoteId: number;
        questionType: QuestionType;
        viceReviewPointIds: number[];
    }

    interface NoteAccessories {
        url: string;
        urlIsVideo: boolean;
        pictureUrl: string;
        pictureMask: string;
        useParentPicture: boolean;
        skipReview: boolean;
        updatedAt: string;
    }

    interface Circle {
        id: number;
        name: string;
    }

    interface Notebook {
        id: number;
        ownership: Ownership;
        headNote: Note;
        skipReviewEntirely: boolean;
        deletedAt: string;
    }

    interface Option {
        note: NoteSphere;
        picture: boolean;
        display: string;
    }

    type LinkType = "related to" | "a specialization of" | "an application of" | "an instance of" | "a part of" | "tagged by" | "an attribute of" | "the opposite of" | "author of" | "using" | "an example of" | "before" | "similar to" | "confused with";

    type QuestionType = "CLOZE_SELECTION" | "SPELLING" | "PICTURE_TITLE" | "PICTURE_SELECTION" | "LINK_TARGET" | "LINK_SOURCE" | "CLOZE_LINK_TARGET" | "DESCRIPTION_LINK_TARGET" | "WHICH_SPEC_HAS_INSTANCE" | "FROM_SAME_PART_AS" | "FROM_DIFFERENT_PART_AS" | "LINK_SOURCE_EXCLUSIVE";

}
