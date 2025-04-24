import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { CookbookRepository } from './cookbook-repository';
import { Cookbook } from './core/cookbook';
import { Public } from './core/public';

@Injectable()
export class CookbookRepositoryFake implements Public<CookbookRepository> {
  private _cookbooks: Cookbook[] = [];

  /**
   * A token that will cause the repository to fail if present in the keywords.
   */
  static readonly INVALID_TOKEN = '💥';

  configure({ cookbooks }: { cookbooks: Cookbook[] }) {
    this._cookbooks = cookbooks;
  }

  /**
   * Returns all cookbooks that match the keywords.
   * If the keywords are null, all cookbooks are returned.
   * If the keywords contain the invalid token "💥", an error is thrown.
   */
  searchCookbooks(keywords: string | null): Observable<Cookbook[]> {
    return defer(() => {
      if (keywords?.includes(CookbookRepositoryFake.INVALID_TOKEN)) {
        throw new Error(
          `CookbookRepositoryFake: Invalid token in keywords "${CookbookRepositoryFake.INVALID_TOKEN}"`,
        );
      }

      let cookbooks = this._cookbooks;

      if (keywords) {
        cookbooks = this._cookbooks.filter((cookbook) =>
          cookbook.title.toLowerCase().includes(keywords.toLowerCase()),
        );
      }

      return of(cookbooks);
    });
  }
}

export function provideCookbookRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    CookbookRepositoryFake,
    {
      provide: CookbookRepository,
      useExisting: CookbookRepositoryFake,
    },
  ]);
}
