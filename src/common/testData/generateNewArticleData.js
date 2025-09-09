import { faker } from '@faker-js/faker';

export function generateNewArticleData(logger, tagNumber = 0) {
  const tags = Array.from({ length: tagNumber }, () => faker.lorem.word());

  const article = {
    title: faker.lorem.words(),
    description: faker.lorem.sentence(4),
    text: faker.lorem.sentences(2),
    tags,
  };

  logger.debug(`Generated new article: ${JSON.stringify(article)}`);

  if (tags.length === 0) {
    logger.warn(`Article does not have tag: ${JSON.stringify(article)}`);
  }

  return article;
}
