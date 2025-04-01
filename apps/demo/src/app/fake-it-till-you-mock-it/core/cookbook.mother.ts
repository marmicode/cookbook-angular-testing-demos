import { Cookbook, createCookbook } from './cookbook';

export const cookbookMother = {
  withBasicInfo(title: string) {
    const id = `cb_${slugify(title)}`;
    return createNestedCookbookMother(
      createCookbook({
        id,
        title,
        authors: [],
        description: `A great cookbook named ${title}`,
        pictureUri: `https://fake-cookbook-api.marmicode.io/cookbook-pictures/${id}`,
        previewUrl: `https://fake-cookbook-api.marmicode.io/cookbooks/${id}`,
      }),
    );
  },
};

function createNestedCookbookMother(cookbook: Cookbook) {
  return {
    build() {
      return cookbook;
    },
    withAuthor(author: string) {
      return createNestedCookbookMother({
        ...cookbook,
        authors: [...cookbook.authors, author],
      });
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
