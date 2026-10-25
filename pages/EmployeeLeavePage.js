import {expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeLeavePage extends BasePage {
    constructor(page){
        super(page)
        this.leaveMenu = page.getByText('Leave')
        this.apply = page.getByRole('link', { name: 'Apply' })
        this.myLeave = page.getByRole('link',{name:'My Leave'})
        this.header = page.getByRole('heading', { name: 'Apply Leave' })
        this.entitlementsMenu = page.getByText('Entitlements',{exact:true})
        this.inputGroup = page.locator('.oxd-input-group')        
        this.leaveTypeDropdown = this.inputGroup.filter({has:page.getByText('Leave Type', { exact: true })}).locator('.oxd-select-wrapper')
        this.fromDateInput = this.inputGroup.filter({ has: page.getByText('From Date', { exact: true }) }).locator('input');
        this.fromDateFormat = this.fromDateInput.getAttribute('placeholder')
        this.toDateInput = this.inputGroup.filter({has:page.getByText( 'To Date',{exact:true})}).locator('input')
        this.toDateFormat = this.toDateInput.getAttribute('placeholder')
        this.commentInput = this.inputGroup.filter({has:page.getByText('Comments',{exact:true})}).locator('textarea')
        this.applyButton = page.getByRole('button', { name: 'Apply' });
        this.successToast = page.locator('.oxd-text--toast-message');

        this.leavePeriodDropdown = page.locator('.oxd-input-group').filter({
                 has: page.getByText('Leave Period', { exact: true })
        }).locator('.oxd-select-wrapper');
        
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.myLeaveMenu = page.getByText('My Leave')
        this.leaveEntitlementsText = this.page.getByText('My Leave Entitlements')

        this.tableHeader = page.locator('.oxd-table-header')
        this.columnHeaders = this.tableHeader.getByRole('columnheader')

        this.leaveListTable = page.locator('.oxd-table-body')
        this.leaveListRows = this.leaveListTable.locator('.oxd-table-card')
        this.leaveListCells = this.leaveListRows.getByRole('cell')
        this.checkbox = page.getByRole('checkbox')

        this.container = page.locator('.orangehrm-header-container')
        this.cancelLeaveButton = this.container.getByRole('button',{name:'Cancel'})

    }

    async navigateToEntitlements(){
        await this.entitlementsMenu.click()
        await this.page.getByRole('menuitem', { name: 'My Entitlements', exact: true }).click()
        await expect(this.page).toHaveURL(/viewMyLeaveEntitlements/)
        // await expect(this.leaveEntitlementsText).toBeVisible()        
    }

    async navigateToMyLeave(){
        await this.myLeave.click()
        expect(this.page).toHaveURL(/viewMyLeaveList/)
    }

    async searchLeaveEntitlements(leavePeriod,formatLeavePeriod){
        await this.leavePeriodDropdown.click()
        // const firstOption = await this.leavePeriodDropdown.getByRole('option', { name: leavePeriod })
        // // await expect(await this.page.getByRole('option')).toBeVisible()

        // if(await firstOption.count() > 0){
        //     await firstOption.click()

        // } else {
        //     console.error(`Leave period option "${leavePeriod}" not found in the dropdown.`);
        //     await this.leavePeriodDropdown.getByRole('option', { name: formatLeavePeriod }).click()
           
        // }

        await this.searchButton.click()
        await expect(this.leaveListTable).toBeVisible()
        // await expect(this.leaveListRows).toHaveCountGreaterThan(0)
        
        console.log('Leave Entitlements:', await this.leaveListCells.allInnerTexts())
    
    }

    async getLeaveEntitlements(){
        await expect(this.leaveListTable).toBeVisible()
        const entitlements = await this.leaveListCells.allInnerTexts()
        return entitlements
    }

    async getTableData(){
        await expect(this.leaveListTable).toBeVisible()

        const myLeaveData = []
        const headers = await this.columnHeaders.allInnerTexts()        

        const rows = this.leaveListRows
        const rowCounts = await this.leaveListRows.count()
        
        for (let row = 0; row < rowCounts; row++){
            const data = {}
            const row_ = await rows.nth(row)
            const cells = await row_.getByRole('cell').allInnerTexts()

            for (let i = 0 ; i<headers.length; i++){
            
                if (headers[i])
                    data[headers[i]] = cells[i]
            
            }
            myLeaveData.push(data)
        }
                
        return myLeaveData
    }

    async navigateToApplyLeave(){
        await this.apply.click()
        await expect(this.page).toHaveURL(/applyLeave/)
    }

    async chooseDateFormatUponPlaceholder(fromDate,toDate){
        const fromDateFormat = await this.fromDateFormat        
        
        function format(date){
            return  date.split('-')
        }                
        
        if (fromDateFormat?.endsWith('mm')) {

            console.log(`@ Date is Altered as requred format ${fromDateFormat} got from date as - ${fromDate} and to date as - ${toDate} !!`)

            const [yy,mm,dd] = format(fromDate)
            const formatDate = `${yy}-${dd}-${mm}`

            const [y,m,d] = format(toDate)
            const formattedToDate = `${y}-${d}-${m}`;

            return {
                fromDate: formatDate,
                toDate: formattedToDate
            };
        }

        return {
            fromDate,
            toDate
        };

    }
    
    async applyLeave(leaveType,fromDate,toDate,comment){
        // await expect(this.header).toBeVisible()

        const {fromDate:choosedFromDate,toDate:choosedToDate} = await this.chooseDateFormatUponPlaceholder(fromDate,toDate)        

        await this.leaveTypeDropdown.click()
        await this.leaveTypeDropdown.getByRole('option', { name: leaveType }).click()
        await this.fromDateInput.clear()        
        await this.fromDateInput.fill(choosedFromDate)
        await this.toDateInput.clear()
        await this.toDateInput.fill(choosedToDate)
        
        await this.commentInput.fill(comment)
        
        await this.applyButton.click()

        await expect(this.successToast).toBeVisible({timeout: 2 * 60 * 1000})
    }

    async cancelLeave(fromDate,toDate){
        await expect(this.page).toHaveURL(/viewMyLeaveList/)

        const { fromDate: formattedFromDate, toDate: formattedToDate } =
            await this.chooseDateFormatUponPlaceholder(fromDate, toDate)

        await this.fromDateInput.fill(formattedFromDate)
        await this.toDateInput.fill(formattedToDate)

        await this.searchButton.click()

        await expect(this.leaveListTable).toBeVisible()

        const leaveDate = `${formattedFromDate} to ${formattedToDate}`
        const leaveRow = this.leaveListRows.filter({
            has: this.page.getByRole('cell', { name: leaveDate, exact: true })
        })

        await expect(leaveRow).toHaveCount(1)

        await leaveRow.getByRole('button', { name: 'Cancel', exact: true }).click()

        await expect(this.successToast).toBeVisible()

    }
    
}
