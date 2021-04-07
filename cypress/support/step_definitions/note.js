import {
  Given,
  And,
  Then,
  When,
  Before,
} from "cypress-cucumber-preprocessor/steps";

Given("there are some notes for the current user", (data) => {
  cy.seedNotes(data.hashes());
})

Given("there are some notes for existing user {string}", (externalIdentifier, data) => {
  cy.seedNotes(data.hashes(), externalIdentifier);
})

Given("there are notes from Note {int} to Note {int}", (from, to) => {
  const notes = Array(to-from+1).fill(0).map((_,i) => {return {'title': `Note ${i+from}`};});
  cy.seedNotes(notes);
})

When("I create top level note with:", (data) => {
  cy.visit("/notes");
  cy.findByText("Add New Notebook").click();
  cy.submitNoteFormWith(data.hashes());
});

When("I am editing note {string} the title is expected to be pre-filled with {string}", (noteTitle, oldTitle) => {
  cy.visit("/notes");
  cy.findNoteCardButton(noteTitle, ".edit-card").click();
  cy.getFormControl('Title').should('have.value', oldTitle);
});

When("I update it to become:", (data) => {
  cy.submitNoteFormWith(data.hashes());
});

When("I create note belonging to {string}:", (noteTitle, data) => {
  cy.jumpToNotePage(noteTitle);
  cy.findByText("(Add Child Note)").click();
  cy.submitNoteFormWith(data.hashes());
});


When("I am creating note under {string}", (noteTitles) => {
  cy.navigateToNotePage(noteTitles);
  cy.findByText("(Add Child Note)").click();
});

Then("I should see {string} in breadcrumb", (noteTitles) => {
  cy.get('.breadcrumb').within( ()=>
      noteTitles.commonSenseSplit(", ").forEach(noteTitle => cy.findByText(noteTitle ))
  )
});

Then("I should see these notes belonging to the user at the top level of all my notes", (data) => {
    cy.visit("/notes");
    cy.expectNoteCards(data.hashes());
});

Then("I should see these notes belonging to the user", (data) => {
    cy.expectNoteCards(data.hashes());
});

When("I delete top level note {string}", (noteTitle) => {
  cy.visit("/notes");
  cy.findNoteCardButton(noteTitle, ".delete-card").click();
});


When("I create a sibling note of {string}:", (noteTitle, data) => {
  cy.findByText(noteTitle, {selector: ".h1"});
  cy.findByText("Add Sibling Note").click();
  cy.submitNoteFormWith(data.hashes());
});

When("I should see that the note creation is not successful", (noteTitle, data) => {
  cy.findByText("size must be between 1 and 100");
});

Then("I should see {string} in note title", (noteTitle) => {
    cy.findByText(noteTitle, {selector: '.h1'});
});

Then("I should not see note {string} at the top level of all my notes", (noteTitle) => {
    cy.visit("/notes");
    cy.findByText("Top Level Notes");
    cy.findByText(noteTitle).should('not.exist');
});

When("I open {string} note from top level", (noteTitles) => {
  cy.navigateToNotePage(noteTitles);
});

When("I should be able to go to the {string} note {string}", (button, noteTitle) => {
    cy.findByRole('button', { name: button }).click();
    cy.get('.jumbotron').within( ()=>
      cy.findByText(noteTitle).should('exist')
    );
});

When("I move note {string} left", (noteTitle) => {
  cy.jumpToNotePage(noteTitle);
  cy.findByText("Move This Note").click();
  cy.findByRole('button', {name: 'Move Left'}).click();
});

When("I should see the screenshot matches", () => {
  // cy.get('.content').toMatchImageSnapshot({ imageConfig: { threshold: 0.001, }, });
});


When("I move note {string} right", (noteTitle) => {
  cy.jumpToNotePage(noteTitle);
  cy.findByText("Move This Note").click();
  cy.findByRole('button', {name: 'Move Right'}).click();
});

When("I should see {string} is before {string} in {string}", (noteTitle1, noteTitle2, parentNoteTitle) => {
  cy.jumpToNotePage(parentNoteTitle);
  var matcher = new RegExp(noteTitle1 + ".*" +noteTitle2, "g");

  cy.get(".card-title").then(($els) => {
    const texts = Array.from($els, el => el.innerText);
    expect(texts).to.match(matcher);
  });


});

// This step definition is for demo purpose
Then("*for demo* I should see there are {int} descendants", (numberOfDescendants) => {
  cy.findByText('' + numberOfDescendants, {selector: '.descendant-counter'})
});

