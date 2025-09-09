import { test, expect } from '@playwright/test';

export class ViewArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleHeader = page.getByRole('heading');
    this.followBtn = page.getByRole('button', { name: /Follow/ }).first();
    this.unfollowBtn = page.getByRole('button', { name: /Unfollow/ }).first();
    this.editArticleBtn = page
      .getByRole('link', { name: 'Edit Article' })
      .first();
    this.articleBody = page.locator(
      'xpath = //*[@id="__next"]/div/div[2]/div[1]/div',
    );
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { username }).first();
  }

  url() {
    return this.page.url();
  }

  async open(url) {
    await test.step(`Open 'View Article' page`, async () => {
      await this.page.goto(url);
    });
  }

  async assertArticleTitleIsVisible(title) {
    await test.step(`Assert the article has correct title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleTextIsVisible(text) {
    await test.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertArticleAuthorNameIsVisible(username) {
    await test.step(`Assert the article has correct author username`, async () => {
      await expect(this.authorLinkInArticleHeader(username)).toBeVisible();
    });
  }
  async follow() {
    await test.step(`Click on the follow btn`, async () => {
      await this.followBtn.waitFor({ state: 'visible' });
      await this.followBtn.click();
    });
  }

  async unfollow() {
    await test.step(`Click on the unfollow btn`, async () => {
      await this.unfollowBtn.waitFor({ state: 'visible' });
      await this.unfollowBtn.click();
    });
  }

  async assertUnfollowBtnIsVisible() {
    await test.step(`Unfollow Btn is visible`, async () => {
      await expect(this.followBtn).toContainText('Unfollow');
    });
  }

  async clickEditArticleBtn() {
    await test.step(`Click on the Edit Article Btn`, async () => {
      await this.editArticleBtn.click();
    });
  }

  async waitForURLAndRefreshPage() {
    await test.step('Refresh page', async () => {
      await this.page.waitForURL('https://conduit.mate.academy/article/*');
      await this.page.reload();
    });
  }

  async assertArticleBodyContainsNewText(text) {
    await test.step(`Assert article has new text after changes`, async () => {
      await expect(this.articleBody).toContainText(text);
    });
  }
}
