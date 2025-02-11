package com.odde.doughnut.entities.json;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public final class AiSuggestion {
  String suggestion;
  String finishReason;
}
