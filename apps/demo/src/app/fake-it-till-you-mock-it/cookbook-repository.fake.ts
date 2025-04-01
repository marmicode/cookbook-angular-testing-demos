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

  configure({ cookbooks }: { cookbooks: Cookbook[] }) {
    this._cookbooks = cookbooks;
  }

  searchCookbooks(keywords: string | null): Observable<Cookbook[]> {
    return defer(() => {
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
