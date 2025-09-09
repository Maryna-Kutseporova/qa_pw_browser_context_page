import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { EditArticlePage } from '../../../src/ui/pages/article/EditArticlePage';

test.beforeEach(async ({ page1, page2, user1, user2, articleWithoutTags }) => {
  await signUpUser(page1, user1);
  await signUpUser(page2, user2);

  await createArticle(page1, articleWithoutTags);
});

test('View an article created by another user', async ({
  page2,
  user2,
  articleWithoutTags,
}) => {
  const viewArticlePage = new ViewArticlePage(page2);

  await viewArticlePage.open(articleWithoutTags.url);

  await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
  await viewArticlePage.assertArticleTextIsVisible(articleWithoutTags.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(user2.username);
});

test('View an article created by another user in the Global Feed', async ({
  page2,
  articleWithoutTags,
}) => {
  const homePage = new HomePage(page2);
  await homePage.openGlobalFeedTab(page2);
  await homePage.assertFirstArticleTitle(articleWithoutTags.title);
});

test('Follow the article created by another user', async ({
  page2,
  articleWithoutTags,
}) => {
  const viewArticlePage = new ViewArticlePage(page2);
  const homePage = new HomePage(page2);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.follow(page2);
  await homePage.open(page2);
  await homePage.assertFirstArticleTitle(articleWithoutTags.title);
});

test('Unfollow the article created by another user', async ({
  page2,
  articleWithoutTags,
}) => {
  const viewArticlePage = new ViewArticlePage(page2);
  const homePage = new HomePage(page2);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.follow(page2);
  await viewArticlePage.unfollow(page2);
  await homePage.open(page2);
  await homePage.assertNoArticlesMsgIsVisible(page2);
});

test('View an article updated by another user', async ({
  page2,
  articleWithoutTags,
  page,
}) => {
  const viewArticlePage2 = new ViewArticlePage(page2);
  const homePage = new HomePage(page2);
  const newArticleBody = 'Some new text';

  await viewArticlePage2.open(articleWithoutTags.url);
  await viewArticlePage2.follow(page2);
  await homePage.open(page2);
  await homePage.openFirstArticle(page2);

  const viewArticlePage = new ViewArticlePage(page);
  const editArticlePage = new EditArticlePage(page);
  await viewArticlePage.clickEditArticleBtn(page);
  await editArticlePage.fillBodyField(newArticleBody);
  await editArticlePage.clickUpdateArticleBtn();
  await viewArticlePage.waitForURLAndRefreshPage();

  await viewArticlePage2.waitForURLAndRefreshPage(page2);
  await viewArticlePage2.assertArticleBodyContainsNewText(newArticleBody);
});

test(`View user's new articles in "Your Feed" after following their profile`, async ({
  page1,
  page2,
  articleWithoutTags,
  articleWithOneTag,
}) => {
  const lastArticleTitle = await articleWithoutTags.title;

  await createArticle(page1, articleWithOneTag);

  const firstArticleTitle = await articleWithOneTag.title;
  const viewArticlePage = new ViewArticlePage(page2);
  const homePage = new HomePage(page2);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.follow(page2);
  await homePage.open(page2);

  await homePage.assertFirstArticleTitle(firstArticleTitle);
  await homePage.assertLastArticleTitle(lastArticleTitle);
});

test(`User doesn't see other user's articles in "Your Feed" after unfollowing their profile`, async ({
  page1,
  page2,
  articleWithoutTags,
  articleWithOneTag,
}) => {
  const lastArticleTitle = await articleWithoutTags.title;

  await createArticle(page1, articleWithOneTag);

  const firstArticleTitle = await articleWithOneTag.title;
  const viewArticlePage = new ViewArticlePage(page2);
  const homePage = new HomePage(page2);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.follow(page2);
  await homePage.open(page2);

  await homePage.assertFirstArticleTitle(firstArticleTitle);
  await homePage.assertLastArticleTitle(lastArticleTitle);

  await viewArticlePage.open(articleWithoutTags.url);
  await viewArticlePage.unfollow(page2);
  await homePage.open(page2);
  await homePage.assertNoArticlesMsgIsVisible(page2);
});
