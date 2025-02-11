import { Ref, ref } from "vue";
import CurrentPosition, {
  CurrentPositionImplementation,
} from "./CurrentPosition";

export default interface NoteStorage extends CurrentPosition {
  updatedNoteRealm?: Generated.NoteRealm;
  focusOnNotebooks(): void;
  selectPosition(
    note?: Generated.Note,
    notePosition?: Generated.NotePositionViewedByUser,
    circle?: Generated.Circle
  ): void;
  refreshNoteRealm(data: Generated.NoteRealm): Generated.NoteRealm;
}

export class StorageImplementation
  extends CurrentPositionImplementation
  implements NoteStorage
{
  updatedNoteRealm?: Generated.NoteRealm;

  cache: Map<Doughnut.ID, Ref<Generated.NoteRealm | undefined>> = new Map();

  focusOnNotebooks(): void {
    this.selectPosition();
    this.updatedNoteRealm = undefined;
  }

  refreshNoteRealm(noteRealm: Generated.NoteRealm): Generated.NoteRealm {
    this.updatedNoteRealm = noteRealm;
    if (this.selectedNote?.id === noteRealm?.id) {
      this.selectedNote = noteRealm?.note;
    }
    this.refOfNoteRealm(noteRealm?.id).value = noteRealm;
    return noteRealm;
  }

  refOfNoteRealm(noteId: Doughnut.ID): Ref<Generated.NoteRealm | undefined> {
    if (!this.cache.has(noteId)) {
      this.cache.set(noteId, ref(undefined));
    }
    return this.cache.get(noteId) as Ref<Generated.NoteRealm | undefined>;
  }
}
