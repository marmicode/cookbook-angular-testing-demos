import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, it } from 'vitest';
import {
  CookbookRepositoryFake,
  provideCookbookRepositoryFake,
} from './cookbook-repository.fake';
import { CookbookSearch } from './cookbook-search';
import { cookbookMother } from './core/cookbook.mother';

describe(CookbookSearch.name, () => {
  it('should search cookbooks without filter initially', async () => {
    await renderCookbookSearch();

    const els = await screen.findAllByRole('heading');
    expect.soft(els).toHaveLength(2);
    expect.soft(els[0]).toHaveTextContent('Ottolenghi Simple');
    expect.soft(els[1]).toHaveTextContent('Burgers 101');
  });

  it('should filter by keywords', async () => {
    await renderCookbookSearch();

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Ottolenghi',
    );

    const els = await screen.findAllByRole('heading');
    expect.soft(els).toHaveLength(1);
    expect.soft(els[0]).toHaveTextContent('Ottolenghi Simple');
  });
});

async function renderCookbookSearch() {
  const ottolenghiSimple = cookbookMother
    .withBasicInfo('Ottolenghi Simple')
    .withAuthor('Ottolenghi')
    .build();
  const anotherCookbook = cookbookMother.withBasicInfo('Burgers 101').build();

  await render(CookbookSearch, {
    providers: [
      provideCookbookRepositoryFake(),
      provideExperimentalZonelessChangeDetection(),
    ],
    configureTestBed(testBed) {
      const fake = testBed.inject(CookbookRepositoryFake);

      fake.configure({
        cookbooks: [ottolenghiSimple, anotherCookbook],
      });
    },
  });
}
