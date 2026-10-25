import {test, expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLeavePage extends BasePage {

    constructor(page){
        super(page)
        this.entitilementsMenu = page.getByText('Entitlements')
        this.inputGroup = page.locator('.oxd-input-group')
        
        this.employeeNameInput = this.inputGroup.filter({ has: page.getByText('Employee Name', { exact: true }) }).locator('input');
        this.leaveTypeDropdown = this.inputGroup.filter({has:page.getByText('Leave Type', { exact: true })}).locator('.oxd-select-wrapper')
        this.leavePeriodDropdown = this.inputGroup.filter({has:page.getByText('Leave Period', { exact: true })}).locator('.oxd-select-wrapper')
        this.options = this.leavePeriodDropdown.getByRole('option')

        this.entitlementInput = this.inputGroup.filter({has:page.getByText('Entitlement', { exact: true })}).locator('input')
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.successToast = page.locator('.oxd-text--toast-message');
        this.toast = page.locator('.oxd-text--toast-message');

        this.confirmationDialog = page.getByRole('document');
        this.confirmationDialogConfirmButton =this.confirmationDialog.getByRole('button', { name: 'Confirm' });
        this.confirmationDialogCancelButton = this.confirmationDialog.getByRole('button', { name: 'Cancel' });

        this.leaveList = page.getByRole('link',{name:'Leave List',exact:true})
        this.searchButton = page.getByRole('button',{name:'Search'})

        this.leaveListTable = page.locator('.oxd-table-body')
        this.leaveListRows = this.leaveListTable.locator('.oxd-table-card')
        this.leaveListCells = this.leaveListRows.getByRole('cell')
        this.approve = this.leaveListRows.getByRole('Approve')
        this.reject = this.leaveListRows.getByRole('Reject')

        
    }

    
    async navigateToEntitlementsAndAddEntitlements(){
        await this.entitilementsMenu.click()        
        await this.page.getByText('Add Entitlements',{exact:true}).click()

        await expect(this.page).toHaveURL(/addLeaveEntitlement/)
        await expect(this.page.getByText('Add Leave Entitlement')).toBeVisible()        

    }

    async navigateToLeaveList(){
        await this.leaveList.click()
        await expect(this.page).toHaveURL(/viewLeaveList/)
    }

    async fillEntitlementForm(employeeFullName,leavetype,leaveperiod,entitlement,formatLeavePeriod){
        await this.employeeNameInput.fill(employeeFullName)
        await this.page.getByRole('option', { name: employeeFullName }).click()
        await this.leaveTypeDropdown.click()
        await this.leaveTypeDropdown.getByRole('option', { name: leavetype }).click()
        await this.leavePeriodDropdown.click()

        await expect(this.options).not.toHaveCount(0)

        // console.log('Options :- ',await this.options.allInnerTexts())

        const firstOption = await this.leavePeriodDropdown.getByRole('option', { name: leaveperiod });
        

        if (await firstOption.count() > 0) {

            await firstOption.click();
            
        } else {
            const secondOption = await this.leavePeriodDropdown.getByRole('option', { name: formatLeavePeriod });
            await secondOption.click();
        }        

        await this.entitlementInput.fill(entitlement)
        await this.saveButton.click()
        // await expect(this.successToast).toBeVisible()

    }

    async confirmEntitlementSave(){
        await this.confirmationDialogConfirmButton.click()
        await expect(this.successToast).toBeVisible()
    }

    async takeActionOnEmployeesLeave(employeeName, action) {
        const employeeRow = this.leaveListRows.filter({
            has: this.page.getByRole('cell', {
                name: employeeName,
                exact: true
            })
        });

        await employeeRow.getByRole('button', {
            name: action,
            exact: true
        }).first().click();
    }

    async searchWithEmployeeName(employeeName){
        await this.employeeNameInput.fill(employeeName)
        await this.page.getByRole('option',{name:employeeName}).click()
        await this.searchButton.click()
    }

    async searchAndApproveLeave(employeeName){
        await this.employeeNameInput.fill(employeeName)
        await this.page.getByRole('option',{name:employeeName}).click()
        await this.searchButton.click()

        await expect(this.leaveListTable).toBeVisible() 
        
        await this.takeActionOnEmployeesLeave(employeeName,'Approve');    

    }

    async searchEmployeeInLeaveList(employeeName){
        await this.employeeNameInput.fill(employeeName)
        await this.page.getByRole('option',{name:employeeName}).click()
        await this.searchButton.click()

    }

    async rejectEmployeesLeave(employeeName){
        await this.employeeNameInput.fill(employeeName)
        await this.page.getByRole('option',{name:employeeName}).click()
        await this.searchButton.click()

        await expect(this.leaveListTable).toBeVisible() 

        await this.takeActionOnEmployeesLeave(employeeName,'Reject')
    }
    

}
