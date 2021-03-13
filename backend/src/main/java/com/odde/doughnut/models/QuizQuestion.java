package com.odde.doughnut.models;

import com.odde.doughnut.entities.NoteEntity;
import com.odde.doughnut.entities.ReviewPointEntity;
import com.odde.doughnut.services.ModelFactoryService;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class QuizQuestion {
    private final NoteEntity noteEntity;
    private final ModelFactoryService modelFactoryService;

    public QuizQuestion(NoteEntity noteEntity, ModelFactoryService modelFactoryService) {
        this.noteEntity = noteEntity;
        this.modelFactoryService = modelFactoryService;
    }

    public String getDescription() {
        Pattern pattern = Pattern.compile(Pattern.quote(noteEntity.getTitle()), Pattern.CASE_INSENSITIVE);
        return pattern.matcher(noteEntity.getDescription()).replaceAll("[...]");
    }

    public List<String> getOptions() {
        TreeNodeModel treeNodeModel = getTreeNodeModel();
        List<String> list = treeNodeModel.getSiblings().stream().map(NoteEntity::getTitle)
                .filter(t->!t.equals(noteEntity.getTitle()))
                .collect(Collectors.toList());
        Collections.shuffle(list);
        List<String> selectedList = list.stream().limit(5).collect(Collectors.toList());
        selectedList.add(noteEntity.getTitle());
        Collections.shuffle(selectedList);

        return selectedList;

    }

    private TreeNodeModel getTreeNodeModel() {
        return modelFactoryService.toTreeNodeModel(noteEntity);
    }
}
