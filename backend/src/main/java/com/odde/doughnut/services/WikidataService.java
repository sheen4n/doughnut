package com.odde.doughnut.services;

import com.odde.doughnut.entities.Note;
import com.odde.doughnut.entities.json.WikidataSearchEntity;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.services.wikidataApis.*;
import java.io.IOException;
import java.util.List;
import lombok.SneakyThrows;
import org.springframework.web.util.UriComponentsBuilder;

public record WikidataService(WikidataApi wikidataApi) {
  public WikidataService(HttpClientAdapter httpClientAdapter, String wikidataUrl) {
    this(
        new WikidataApi(
            new QueryBuilder(httpClientAdapter, UriComponentsBuilder.fromHttpUrl(wikidataUrl))));
  }

  public List<WikidataSearchEntity> searchWikidata(String search)
      throws IOException, InterruptedException {
    return wikidataApi.getWikidataSearchEntities(search).getWikidataSearchEntities();
  }

  public WikidataIdWithApi wrapWikidataIdWithApi(String wikidataId) {
    return new WikidataId(wikidataId).withApi(wikidataApi);
  }

  @SneakyThrows
  public WikidataIdWithApi associateToWikidata(
      Note note, String wikidataId, ModelFactoryService modelFactoryService) {
    note.setWikidataId(wikidataId);
    modelFactoryService.toNoteModel(note).checkDuplicateWikidataId();
    return wrapWikidataIdWithApi(wikidataId);
  }
}
