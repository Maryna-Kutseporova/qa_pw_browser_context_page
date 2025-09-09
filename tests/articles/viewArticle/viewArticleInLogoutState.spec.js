import { test } from '../../_fixtures/fixtures';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.beforeEach(async ({ user1, articleWithoutTags, browser }) => {
  const guestContext = await browser.newContext();
  const page1 = await guestContext.newPage();
  await signUpUser(page1, user1);

  await createArticle(page1, articleWithoutTags);
  await guestContext.close();
});

test('User can see own article in Global feed when not logged in', async ({
  articleWithoutTags,
  homePage2,
  user1,
  page2,
}) => {
  await page2.context().clearCookies();
  await page2.goto('/');
  await page2.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await homePage2.open(page2);
  await homePage2.refreshPage(page2);
  await homePage2.refreshPage(page2);
  await homePage2.refreshPage(page2);
  await homePage2.refreshPage(page2);
  await homePage2.assertArticleByTitleAndAuthor(
    articleWithoutTags.title,
    user1.username,
  );
});
