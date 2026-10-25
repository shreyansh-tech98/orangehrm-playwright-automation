import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.userError = page
      .locator('.oxd-input-field-bottom-space')
      .filter({ has: this.usernameInput })
      .locator('span');
    this.passwordError = page
      .locator('.oxd-input-field-bottom-space')
      .filter({ has: this.password })
      .locator('span');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.logo = page.getByAltText('company-branding');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible()
    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
  }

  async getError() {
    return await this.errorMessage.textContent();
  }

  async getUserError() {
    return await this.userError.textContent();
  }

  async getPasswordError() {
    return await this.passwordError.textContent();
  }

  async isLoginPageDisplayed() {
    await expect(this.logo).toBeVisible();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}
