import { flushPromises } from "@vue/test-utils";
import NoteSuggestDescriptionDialog from "@/components/notes/NoteSuggestDescriptionDialog.vue";
import makeMe from "../fixtures/makeMe";
import helper from "../helpers";

helper.resetWithApiMock(beforeEach, afterEach);

describe("NoteSuggestDescriptionDialog", () => {
  it("fetch from api", async () => {
    const note = makeMe.aNoteRealm.please();
    helper.apiMock
      .expectingPost(`/api/ai/ask-suggestions`)
      .andReturnOnce({ suggestion: "suggestion" });
    const wrapper = helper
      .component(NoteSuggestDescriptionDialog)
      .withStorageProps({ selectedNote: note })
      .mount();
    await flushPromises();
    expect(wrapper.find("textarea").element).toHaveValue("suggestion");
  });
});