package com.odde.doughnut.models.quizFacotries;

import com.odde.doughnut.entities.Link;
import java.util.List;

public class NullParentGrandLinkHelper implements ParentGrandLinkHelper {

  @Override
  public Link getParentGrandLink() {
    return null;
  }

  @Override
  public List<Link> getCousinLinksAvoidingSiblings() {
    return List.of();
  }
}