import { outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { page, server } from 'vitest/browser';
import { CookbookFilter, CookbookFilterForm } from './cookbook-filter-form.ng';

/* Preview mode is affected by the fake timers.
 * As of 4.1.0, Locator#fill will never resolve.
 * Cf. https://github.com/vitest-dev/vitest/issues/9882 */
describe.skipIf(server.provider === 'preview')(CookbookFilterForm, () => {
  it('does not emit filterChange while debounce is pending', async () => {
    const { filterChangeSpy, keywordsInput } = await mountFilterForm();

    await keywordsInput.fill('Angular Testing');

    // Advance by 290ms (debounce duration - 10ms).
    await vi.advanceTimersByTimeAsync(290);

    expect(filterChangeSpy).not.toHaveBeenCalled();
  });

  it('emits filterChange after debounce', async () => {
    const { filterChangeSpy, keywordsInput } = await mountFilterForm();

    await keywordsInput.fill('Angular Testing');

    // Advance by 310ms (debounce duration + 10ms).
    await vi.advanceTimersByTimeAsync(310);

    expect(filterChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ keywords: 'Angular Testing' }),
    );
  });
});

async function mountFilterForm() {
  const filterChangeSpy = vi.fn<(filter: CookbookFilter) => void>();

  vi.useFakeTimers();
  onTestFinished(() => {
    vi.useRealTimers();
  });

  TestBed.createComponent(CookbookFilterForm, {
    bindings: [outputBinding<CookbookFilter>('filterChange', filterChangeSpy)],
  });

  await vi.runAllTimersAsync();

  return { filterChangeSpy, keywordsInput: page.getByLabelText('Keywords') };
}
