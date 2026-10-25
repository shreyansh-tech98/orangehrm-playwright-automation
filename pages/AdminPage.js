import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.adminHeader = page.getByRole('heading', { name: 'Admin' });

    this.addButton = page.getByRole('button', { name: 'Add' });

    this.userRoleDropdown = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'User Role', exact: true })
      .locator('i');

    this.employeeName = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name', exact: true })
      .locator('input');
    this.findOption = page.getByRole('listbox').getByRole('option');

    this.statusDropdown = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Status', exact: true })
      .locator('i');

    this.userNameInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username', exact: true })
      .locator('input');
    this.userNameErrorMassege = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username', exact: true })
      .locator('span');
    this.passwordInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Password', exact: true })
      .locator('input');
    this.confirmPasswordInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Confirm Password', exact: true })
      .locator('input');

    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // this.searchByUsername = page.locator('.oxd-input-group').filter({hasText:'Username',exact:true}).locator('input')
    this.searchButton = page.getByRole('button', { name: 'Search' });

    this.userTable = page.getByRole('table');
    this.userTableRows = this.userTable.getByRole('row');
    this.trashIcon = this.userTableRows.getByRole('cell').locator('.bi-trash');

    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.cancelDeleteButton = page.getByRole('button', { name: 'No, Cancel' });

    this.toastMassege = page.locator('.oxd-text--toast-message');
  }

  async clickAddUser() {
    await this.addButton.click();
    await expect(this.adminHeader).toBeVisible();
  }

  async fillUserDetails(userRole, employeeName, status, username, password) {
    await this.userRoleDropdown.click();
    await this.findOption.getByText(userRole).click();

    await this.employeeName.fill(employeeName);
 
    await this.findOption.getByText(employeeName).click();

    await this.statusDropdown.click();
    await this.findOption.getByText(status).click();

    await this.userNameInput.fill(username);

    await this.passwordInput.first().fill(password);
    await this.confirmPasswordInput.last().fill(password);

    await this.saveButton.click();

    await expect(this.toastMassege).toBeVisible();
  }

  async searchUserByUsername(username) {
    // await expect(this.page).toHaveURL('/viewSystemUsers/')
    await expect(this.userNameInput).toBeVisible();

    await this.userNameInput.fill(username);
    await this.searchButton.click();
  }

  async deleteUserByUsername(username) {
    await expect(this.userTable).toBeVisible();

    await this.userTableRows.filter({ hasText: username }).locator('.bi-trash').click();
    await this.confirmDeleteButton.click();
    await expect(this.toastMassege).toBeVisible();
  }
}
