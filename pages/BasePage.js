import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async waitForElement(selector, timeout = 5000, state = 'v') {
    const states = { v: 'visible', h: 'hidden', a: 'attached', d: 'detached' };

    await this.page.locator(selector).waitFor({ state: states[state], timeout: timeout });
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getPageUrl() {
    return await this.page.url();
  }
}
