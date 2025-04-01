import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cookbook, createCookbook } from './core/cookbook';

@Injectable({
  providedIn: 'root',
})
export class CookbookRepository {
  private readonly _apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private readonly _http = inject(HttpClient);

  searchCookbooks(keywords: string | null): Observable<Cookbook[]> {
    const queryItems = ['+subject:Cooking'];

    if (keywords) {
      queryItems.push(keywords);
    }

    return this._http
      .get<GoogleVolumesResponse>(this._apiUrl, {
        params: {
          q: queryItems.join(' '),
          langRestrict: 'en',
        },
      })
      .pipe(
        map((response) => {
          return response.items.map((item) =>
            createCookbook({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors ?? [],
              description: item.volumeInfo.description,
              pictureUri: this._imageLinksToUri(item.volumeInfo.imageLinks),
              previewUrl: item.volumeInfo.previewLink,
            }),
          );
        }),
      );
  }

  private _imageLinksToUri(
    imageLinks: GoogleVolume['volumeInfo']['imageLinks'],
  ): string | undefined {
    if (!imageLinks) {
      return;
    }

    if (imageLinks.medium) {
      return imageLinks.medium;
    }

    if (imageLinks.thumbnail) {
      const url = new URL(imageLinks.thumbnail);
      url.searchParams.set('fife', 'w400-h600');
      return url.toString();
    }

    return;
  }
}

interface GoogleVolumesResponse {
  items: GoogleVolume[];
}

interface GoogleVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description: string;
    imageLinks?: {
      thumbnail?: string;
      medium?: string;
    };
    previewLink: string;
  };
}
