import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PIMPage extends BasePage {
  constructor(page) {
    super(page);
    this.pimHeader = page.getByRole('heading', { name: 'PIM' });
    this.topNavigation = page.getByLabel('Topbar Menu');
    this.addEmployeeButton = this.topNavigation.getByRole('link', { name: 'Add Employee' });

    this.imageEditForm = page.locator('.oxd-form-row img') 
    this.imageContainer = page.locator('.orangehrm-card-container img')   
    this.fileUpload = page.locator('input[type="file"]')
    this.impageArea = page.locator('.employee-image')
    

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');

    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successToast = page.locator('.oxd-text--toast-message');

    this.employeeListButton = this.topNavigation.getByRole('link', { name: 'Employee List' });

    this.tablefilter = page.locator('.oxd-table-filter');
    this.searchByNameInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .locator('input');
    this.searchDropdown = page.locator('.oxd-input-group').getByRole('listbox').getByRole('option');
    this.searchButton = this.tablefilter.getByRole('button', { name: 'Search' });
    this.employeeTable = page.getByRole('table');
    this.employeeTableRows = this.employeeTable.locator('.oxd-table-card');
    this.employeeTableCells = this.employeeTableRows.getByRole('cell')
    this.trashIcon = this.employeeTableRows.getByRole('cell').locator('.bi-trash');
    
    this.loginDetailToggle =  page.locator('.oxd-switch-input');

    this.inputGroup = page.locator('.oxd-input-group')
    this.usernameInput = this.inputGroup.filter({ has: page.getByText('Username', { exact: true }) }).locator('input');
    this.passwordInput = this.inputGroup.filter({ has: page.getByText('Password', { exact: true }) }).locator('input');
    this.confirmPasswordInput = this.inputGroup.filter({ has: page.getByText('Confirm Password', { exact: true }) }).locator('input');

    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.cancelDeleteButton = page.getByRole('button', { name: 'No, Cancel' });
    this.noRecordsFoundMessage = page.getByText('No Records Found');
  }
  
  

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
    await expect(this.page).toHaveURL(/addEmployee/);
    await expect(this.firstNameInput).toBeVisible();
  }
  
  async uploadEmployeePhoto(pic){
    const srcAtrbt = await this.imageEditForm.getAttribute('src') 

    await this.fileUpload.setInputFiles(pic)     

    await expect(this.imageEditForm).not.toHaveAttribute('src',srcAtrbt)

    const savebuttons = await this.saveButton.count()

    if(savebuttons>1)
      await this.saveButton.last().click();
    else 
      await this.saveButton.last().click();
    
  }

  async getNewSrcAttributeFromAdmin(){
    const src = await this.imageEditForm.getAttribute('src') 

    return src
  }

  async verifyEmployeesUploadedImg(adminUploadedSrc){
    // console.log(`Admin Src = ${adminUploadedSrc} and employee src = ${await this.imageContainer.getAttribute('src')}`)
    expect(adminUploadedSrc).toMatch(/^data:image\//);
    await expect(this.imageContainer).toBeVisible();
    await expect.poll(
      () => this.imageContainer.evaluate((image) => image.complete && image.naturalWidth > 0)
    ).toBe(true);
  }

  async addEmployee(firstName, middleName, lastName, employeeId) {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill(employeeId);
    
  }

  async createEmployeeLoginDetails(username, password) {
   
    await this.loginDetailToggle.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.saveButton.click();
    }

  async getSuccessfullMessage() {
    return await this.successToast.textContent();
  }

  async navigateToEmployeeList() {
    await this.employeeListButton.click();
    await expect(this.page).toHaveURL(/viewEmployeeList/);
    await expect(this.searchByNameInput).toBeVisible();
  }

  async searchEmployeeByName(employeeName) {
    await this.searchByNameInput.click();
    await this.searchByNameInput.fill(employeeName);
    await expect(this.searchDropdown).toBeVisible();
    await this.searchDropdown.getByText(employeeName).click();
    await this.searchButton.click();
    await expect(this.employeeTable).toBeVisible();
  }

  async getEmployeeTableRowsCount() {
    return await this.employeeTableRows.count();
  }

  async deleteEmployeeByName(employeeName) {
    await expect(this.employeeTableRows.filter({ hasText: employeeName })).toBeVisible();

    await this.employeeTableRows.filter({ hasText: employeeName }).locator('.bi-trash').click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();

    await expect(this.successToast).toBeVisible();
  }

  async clickOnImageArea(){
    await expect(this.impageArea).toBeVisible()
    await this.impageArea.click()

  }

  async editEmployeeByName(employeeName) {    

    const empRow = await this.employeeTableRows.filter({ hasText: employeeName })
    await expect(empRow).toBeVisible()
    await empRow.locator('.bi-pencil-fill').click(); 
    await expect(this.page).toHaveURL(/viewPersonalDetails/) 
    
  }

  async isNoRecordsFoundMessageVisible() {
    return await this.noRecordsFoundMessage.isVisible();
  }
}
