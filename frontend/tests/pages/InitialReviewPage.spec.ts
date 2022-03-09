/**
 * @jest-environment jsdom
 */
import fetchMock from "jest-fetch-mock";
import InitialReviewPage from '@/pages/InitialReviewPage.vue';
import flushPromises from 'flush-promises';
import { StoredComponentTestHelper } from '../helpers';
import makeMe from '../fixtures/makeMe';

let helper: StoredComponentTestHelper

beforeEach(() => {
  fetchMock.resetMocks();
  helper = new StoredComponentTestHelper()
});

describe('repeat page', () => {
  it('redirect to review page if nothing to review', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { mockRouter } = helper.component(InitialReviewPage).currentRoute({ name: 'initial' }).mount()
    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reviews/initial',
      expect.anything()
    );
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'reviews' });
  });

  it('normal view', async () => {
    const note = makeMe.aNote.please();
    const reviewPoint = makeMe.aReviewPoint
      .ofNote(note)
      .remainingInitialReviewCountForToday(53)
      .please();
    fetchMock.mockResponseOnce(JSON.stringify(reviewPoint));

    const { wrapper, mockRouter } = helper.component(InitialReviewPage).currentRoute({ name: 'initial' }).mount()
    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reviews/initial',
      expect.anything()
    );
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
    expect(wrapper.findAll('.initial-review-container')).toHaveLength(0);
    expect(wrapper.findAll('.pause-stop')).toHaveLength(1);
    expect(wrapper.find('.progress-text').text()).toContain(
      'Initial Review: 0/53'
    );
  });

  it('minimized view', async () => {
    const note = makeMe.aNote.please();
    const reviewPoint = makeMe.aReviewPoint.ofNote(note).please();
    fetchMock.mockResponseOnce(JSON.stringify(reviewPoint));
    const { wrapper, mockRouter } = helper.component(InitialReviewPage).withProps({nested: true}).currentRoute({ name: 'initial' }).mount()
    await flushPromises();
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
    expect(wrapper.findAll('.initial-review-container')).toHaveLength(1);
    expect(wrapper.find('.review-point-abbr span').text()).toContain(
      note.title
    );
  });
});