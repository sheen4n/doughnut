Feature: Nested Note Create with wikidata
  As a learner, I want to maintain my newly acquired knowledge in
  notes with an associated wikidata, so that I can review them in the future.

  Background:
    Given I've logged in as an existing user
    And there are some notes for the current user
      | title          | testingParent  | description         |
      | Animals |                | An awesome training |

  @ignore
  Scenario: Create a new note with a wikidata id
    When I create note belonging to "Animals":
      | Title | WikidataId |
      | snake | Q1234      |