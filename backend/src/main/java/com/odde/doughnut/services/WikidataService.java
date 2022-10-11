package com.odde.doughnut.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.odde.doughnut.entities.Coordinate;
import com.odde.doughnut.entities.json.WikidataEntityData;
import com.odde.doughnut.entities.json.WikidataSearchEntity;
import com.odde.doughnut.services.externalApis.WikidataEntityDataHash;
import com.odde.doughnut.services.externalApis.WikidataEntityHash;
import com.odde.doughnut.services.externalApis.WikidataSearchModel;
import com.odde.doughnut.services.externalApis.WikidataValue;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import lombok.SneakyThrows;
import org.apache.logging.log4j.util.Strings;
import org.springframework.web.util.UriComponentsBuilder;

public record WikidataService(HttpClientAdapter httpClientAdapter, String wikidataUrl) {
  private UriComponentsBuilder wikidataUriBuilder() {
    return UriComponentsBuilder.fromHttpUrl(wikidataUrl);
  }

  public Optional<WikidataEntityData> fetchWikidataEntityData(String wikidataId)
      throws IOException, InterruptedException {
    String responseBody = httpClientAdapter.getResponseString(ConstructWikidataUrl(wikidataId));

    if (Strings.isEmpty(responseBody)) {
      return Optional.empty();
    }

    WikidataEntityDataHash wikidataEntityDataHash =
        getObjectMapper().readValue(responseBody, new TypeReference<>() {});
    return Optional.of(wikidataEntityDataHash.getWikidataEntity(wikidataId));
  }

  private URI ConstructWikidataUrl(String wikidataId) {
    return wikidataUriBuilder()
        .path("/wiki/Special:EntityData/" + wikidataId + ".json")
        .build()
        .toUri();
  }

  private ObjectMapper getObjectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    return mapper;
  }

  public List<WikidataSearchEntity> fetchWikidataByQuery(String search)
      throws IOException, InterruptedException {
    String responseBody =
        queryWikidataApi(
            "wbsearchentities",
            (uriComponentsBuilder ->
                uriComponentsBuilder
                    .queryParam("search", "{search}")
                    .queryParam("format", "json")
                    .queryParam("language", "en")
                    .queryParam("uselang", "en")
                    .queryParam("type", "item")
                    .queryParam("limit", 10)
                    .build(search)));
    WikidataSearchModel entities =
        getObjectMapper().readValue(responseBody, new TypeReference<>() {});
    return entities.getWikidataSearchEntities();
  }

  @SneakyThrows
  public Optional<String> getWikidataDescription(String wikidataId) {
    return Optional.ofNullable(getEntityHashById(wikidataId))
        .flatMap(
            d -> {
              return d.getDescription(this, d.getEntity(wikidataId));
            });
  }

  @SneakyThrows
  public Optional<Coordinate> getWikidataCoordinate(String wikidataId) {
    return Optional.ofNullable(getEntityHashById(wikidataId))
        .flatMap(d -> d.getCoordinate(wikidataId));
  }

  public WikidataEntityHash getEntityHashById(String wikidataId)
      throws IOException, InterruptedException {
    String responseBody =
        queryWikidataApi(
            "wbgetentities",
            (builder) ->
                builder
                    .queryParam("ids", "{id}")
                    .queryParam("format", "json")
                    .queryParam("props", "claims")
                    .build(wikidataId));
    if (responseBody == null) return null;
    try {
      return getObjectMapper().readValue(responseBody, new TypeReference<>() {});
    } catch (MismatchedInputException e) {
      return null;
    }
  }

  private String queryWikidataApi(String action, Function<UriComponentsBuilder, URI> uriBuilder)
      throws IOException, InterruptedException {
    URI uri =
        uriBuilder.apply(wikidataUriBuilder().path("/w/api.php").queryParam("action", action));
    return httpClientAdapter.getResponseString(uri);
  }

  @SneakyThrows
  public Optional<String> getTitle(WikidataValue wikiId) {
    return fetchWikidataEntityData(wikiId.toWikiClass()).map(e -> e.WikidataTitleInEnglish);
  }
}
