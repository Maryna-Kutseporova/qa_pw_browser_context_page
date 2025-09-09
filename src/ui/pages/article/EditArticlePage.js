import { test, expect } from '@playwright/test';

export class EditArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleHeader = page.getByRole('heading');
    this.articleBody = page.getByPlaceholder(
      'Write your article (in markdown)',
    );
    this.updateArticleBtn = page.getByRole('button', {
      name: 'Update Article',
    });
  }

  async assertArticleTitle(title) {
    await test.step(`Assert the article has correct title'`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await test.step(`Assert the article has correct text'`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async fillBodyField(text) {
    await test.step(`Fill the Article body field`, async () => {
      await this.articleBody.fill(text);
    });
  }

  async clickUpdateArticleBtn() {
    await test.step(`Click on the Update Article Btn`, async () => {
      await this.updateArticleBtn.click();
    });
  }
}
