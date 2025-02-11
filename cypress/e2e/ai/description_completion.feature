Feature: Note description completion

  Background:
    Given I've logged in as an existing user
    And there are some notes for the current user
      | title       | description     |
      | 台北的天氣    | 台北的冬天       |

  @usingMockedOpenAiService
  Scenario: AI will complete the description of a note
    Given OpenAI returns text completion "台北冬天每天都在下雨,晴天的機率可能比刮刮樂還低" for prompt "台北的冬天"
    When I ask to complete the description for note "台北的天氣"
    Then I should see the note description on current page becomes "台北冬天每天都在下雨,晴天的機率可能比刮刮樂還低"
