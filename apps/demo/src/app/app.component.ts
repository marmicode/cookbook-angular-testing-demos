import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CookbookSearch } from './fake-it-till-you-mock-it/cookbook-search';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-root',
  imports: [CookbookSearch],
  template: ` <mc-cookbook-search />`,
})
export class AppComponent {}
