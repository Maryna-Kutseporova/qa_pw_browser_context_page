import { expect, test } from '@playwright/test';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.yourFeedTab = page.getByText('Your Feed');
    this.globalFeedTab = page.getByText('Global Feed');
    this.newArticleLink = page.getByRole('link', {
      name: 'New Article',
    });
    this.firstArticleTitle = page.locator('.article-preview h1').first();
    this.lastArticleTitle = page.locator(
      'xpath =/html/body/div/div/div/div/div[1]/div[3]/a/h1',
    );
    this.noArticlesMsg = page.getByText('No articles are here... yet.');
    this.articleCreatorLink = page.locator('a.author').first();
    this.settingsBtn = page.getByRole('link', { name: 'Settings' });
  }

  async open() {
    await test.step(`Open 'Home' page`, async () => {
      await this.page.goto('/');
    });
  }

  async refreshPage(page) {
    await test.step(`Refresh the page`, async () => {
      await this.page.waitForTimeout(5000);
      await this.page.reload(page);
    });
  }

  async clickNewArticleLink() {
    await test.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await test.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async openGlobalFeedTab(page) {
    await test.step(`Open 'Global feed tab' page`, async () => {
      await page.getByText('Global Feed').click();
    });
  }

  async assertFirstArticleTitle(title) {
    await test.step(`Assert the first article has correct title'`, async () => {
      await this.firstArticleTitle.waitFor({ state: 'visible', timeout: 5000 });
      await expect(this.firstArticleTitle).toHaveText(
        `Article title: ${title}`,
      );
    });
  }

  async assertLastArticleTitle(title) {
    await test.step(`Assert the last article has correct title'`, async () => {
      await expect(this.lastArticleTitle).toHaveText(`Article title: ${title}`);
    });
  }

  async assertNoArticlesMsgIsVisible() {
    await test.step(`Assert the 'No articles'msg is visible`, async () => {
      await expect(this.noArticlesMsg).toBeVisible();
    });
  }

  async openFirstArticle() {
    await test.step(`Open first article`, async () => {
      await this.firstArticleTitle.click();
    });
  }

  async clickfirstArticleLink() {
    await test.step(`Click the Article title link`, async () => {
      await this.firstArticleTitle.click();
    });
  }

  async openSettings() {
    await test.step(`Click on the Settings btn`, async () => {
      await this.settingsBtn.click();
    });
  }

  async assertArticleByTitleAndAuthor(title, author) {
    await test.step(`Assert that article with title "${title}" and author "${author}" is visible`, async () => {
      const article = this.page
        .locator('div.article-preview')
        .filter({
          has: this.page.locator('h1', { hasText: title }),
        })
        .filter({
          has: this.page.locator('.author', { hasText: author }),
        });

      await expect(article).toBeVisible({ timeout: 5000 });
      await expect(article.locator('h1')).toContainText(title);
      await expect(article.locator('a.author')).toHaveText(
        author.toLowerCase(),
      );
    });
  }
}
