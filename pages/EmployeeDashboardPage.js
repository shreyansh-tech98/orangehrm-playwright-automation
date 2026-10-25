import {expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeDashboardPage extends BasePage {
   
  constructor(page) {
    super(page);

    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-name');
    this.logoutLink = page.getByRole('menu').getByText('Logout');
    this.sidemenu = page.locator('.oxd-sidepanel-body');
    this.adminMenu = this.sidemenu.getByRole('link', { name: 'Admin' });
    this.pimMenu = this.sidemenu.getByRole('link', { name: 'PIM' });
    this.leaveMenu = this.sidemenu.getByRole('link', { name: 'Leave' });
    this.timeMenu = this.sidemenu.getByRole('link', { name: 'Time' });
    this.myInfoMenu = this.sidemenu.getByRole('link', { name: 'My Info' });
  }

  async isDashboardLoaded() {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/login/);
  }

  async navigateToAdmin() {
    await this.adminMenu.click();
    await expect(this.page).toHaveURL(/admin/);
  }

  async navigateToPIM() {
    await this.pimMenu.click();
    await expect(this.page).toHaveURL(/pim/);
  }

  async navigateToLeave() {
    await this.leaveMenu.click();
    await expect(this.page).toHaveURL(/leave/);
  }

  async navigateToTime() {
    await this.timeMenu.click();
    await expect(this.page).toHaveURL(/time/);
  }

  async navigateToMyInfo() {
    await this.myInfoMenu.click();
    await expect(this.page).toHaveURL(/myinfo/);
  }

  async getLoggedInUsername() {
    return await this.userDropdown.textContent();
  }

}