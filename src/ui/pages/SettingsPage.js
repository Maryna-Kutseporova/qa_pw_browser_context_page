import { expect, test } from '@playwright/test';

export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.newPasswordField = page.getByPlaceholder('New Password');
    this.updateSettingsBtn = page.getByRole('button', {
      name: 'Update Settings',
    });
  }

  async changePassword(new_password) {
    await test.step(`Change password on the Settings page`, async () => {
      await this.newPasswordField.fill(new_password);
      await this.updateSettingsBtn.click();
    });
  }
}
