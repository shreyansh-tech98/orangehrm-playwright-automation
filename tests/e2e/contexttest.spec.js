import { test, expect } from '../../fixtures/testFixtures.js';
import { faker } from '@faker-js/faker';

test.describe('Context Testing @contextTesting ', () => {

    const employeeData = {};

    const leaveType = 'CAN - Vacation'//'CAN - Personal'
    const fromDate = '2026-10-09'
    const toDate = '2026-10-10'
    const comment = 'Vacation Leave'
    const fromDateminusToDate = new Date(toDate) - new Date(fromDate)  
    const diffDate = String(fromDateminusToDate/(1000 * 60 * 60 * 24))
    const leavePeriod = '2026-01-01 - 2026-31-12'
    const formatLeavePeriod = '2026-01-01 - 2026-12-31'
    const entitlement = '20'


    test.beforeEach(async ({
        adminDashboardPage,
        adminPimPage,
        employeePages
    }) => {
        test.setTimeout(10 * 60 * 1000);

        // Generate employee data
        let firstName;

        do {
            firstName = faker.person.firstName();
        } while (firstName.length < 5);

        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        const employeeId = String(
            faker.number.int({ min: 10000, max: 99999 })
        );

        const username = firstName;
        const password = `${firstName}@123`;

        console.log('Generated Employee Data:', {
            firstName,
            middleName, 
            lastName,
            employeeId,
            username,
            password
        });

        employeeData.firstName = firstName;
        employeeData.middleName = middleName;
        employeeData.lastName = lastName;
        employeeData.employeeId = employeeId;
        employeeData.username = username;
        employeeData.password = password;
        employeeData.employeeFullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`;

        await adminDashboardPage.navigateTo('/web/index.php/dashboard/index');
        // Admin creates employee
        await adminDashboardPage.navigateToPIM();

        await adminPimPage.clickAddEmployee();

        await adminPimPage.addEmployee(
            employeeData.firstName,
            employeeData.middleName,
            employeeData.lastName,
            employeeData.employeeId,
            
        );

        await adminPimPage.createEmployeeLoginDetails(
            employeeData.username,
            employeeData.password
        );

        // await expect(adminPimPage.successToast)
        //     .toHaveText('Successfully Saved',{timeout:6*60*1000});

        // Prepare employee context
        await employeePages.goto('/web/index.php/auth/login');
        // await employeePages.pause()
    });

    test.skip('Add Entitlements from admin and apply leave from employee  @contextTesting', async ({       
        employeePages,
        employeeLoginPage,
        employeeDashboardPage,
        employeeLeavePage,
        adminLeavePage,
        adminDashboardPage
    }) => {

        test.setTimeout(3 * 60 * 1000);

        await test.step('Employee logins',async()=>{
            // await this.employeeLoginPage.pause()
            await employeeLoginPage.login(employeeData.username,employeeData.password);
        })        
       
        
       
        await test.step('admin adds leave entitlements for employee',async()=>{
            await expect(employeePages).toHaveURL(/dashboard/);
            await adminDashboardPage.navigateToLeave();
            await adminLeavePage.navigateToEntitlementsAndAddEntitlements()
            
            await adminLeavePage.fillEntitlementForm(employeeData.employeeFullName,leaveType,leavePeriod,entitlement,formatLeavePeriod)
                    
            await adminLeavePage.confirmEntitlementSave()

        })
        
        await test.step('Employee Navigates to the leave entitlements and search leaves',async()=>{
            await employeeDashboardPage.navigateToLeave()
            await employeeLeavePage.navigateToEntitlements()
            await employeeLeavePage.searchLeaveEntitlements(leavePeriod,formatLeavePeriod)

            expect(await employeeLeavePage.getLeaveEntitlements()).toContain(entitlement)
            expect(await employeeLeavePage.getLeaveEntitlements()).toContain(leaveType)

        })
       
        await test.step('Employee apply the leaves',async()=>{
            await employeeLeavePage.navigateToApplyLeave()

            await employeeLeavePage.applyLeave(leaveType,fromDate,toDate,comment)

            const addDaysToIsoDate = (isoDate, days) => {
                const date = new Date(`${isoDate}T00:00:00Z`);
                date.setUTCDate(date.getUTCDate() + days);
                return date.toISOString().slice(0, 10);
            };

            const nextFromDate = addDaysToIsoDate(fromDate, 3);
            const nextToDate = addDaysToIsoDate(toDate, 3);

            await employeeLeavePage.applyLeave(leaveType,nextFromDate,nextToDate,comment)
            
        })                       
        
        await test.step('Admin Navigates to leave list , Search and Approves leave',async()=>{
            await adminLeavePage.navigateToLeaveList()
            await adminLeavePage.searchAndApproveLeave(employeeData.employeeFullName)
        })
       

        await test.step('Employee navigates to the apply leave and checks the remaining leave',async()=>{
            await employeeLeavePage.navigateToMyLeave()
            const data = await employeeLeavePage.getTableData()
            console.log('User Data',data)

            expect(await employeeLeavePage.getLeaveEntitlements()).toContain(diffDate+'.00')  

        })                     
        
    });

    test.skip('Cancel a pending leave requiest',
        async({adminDashboardPage,
        adminLeavePage,
        employeeDashboardPage,
        employeeLeavePage,
        employeeLoginPage,
        employeePages
        })=>{
        
        test.setTimeout(2*60*1000)

        await test.step('Employee logins',async()=>{
            // await this.employeeLoginPage.pause()
            await employeeLoginPage.login(employeeData.username,employeeData.password);
        })        
               
       
        await test.step('admin adds leave entitlements for employee',async()=>{
            await expect(employeePages).toHaveURL(/dashboard/);
            await adminDashboardPage.navigateToLeave();
            await adminLeavePage.navigateToEntitlementsAndAddEntitlements()
            
            await adminLeavePage.fillEntitlementForm(employeeData.employeeFullName,leaveType,leavePeriod,entitlement,formatLeavePeriod)
                    
            await adminLeavePage.confirmEntitlementSave()

        })
        
        await test.step('employee applies for the leave',async()=>{
            await employeeDashboardPage.navigateToLeave()
            await employeeLeavePage.navigateToApplyLeave()
            await employeeLeavePage.applyLeave(leaveType,fromDate,toDate,comment)
        })

        await test.step('admin verifies the pending request',async()=>{
            await adminDashboardPage.navigateToLeave()
            await expect(adminLeavePage.leaveListTable).toBeVisible()

        })
        
        await test.step('employee cancels the leave',async()=>{
            await employeeLeavePage.navigateToMyLeave()
            await employeeLeavePage.cancelLeave(fromDate,toDate)

        })       
        
        await test.step('admin verifies the final state',async()=>{
            await adminLeavePage.navigateToLeaveList()
            await adminLeavePage.searchWithEmployeeName(employeeData.employeeFullName)

            await expect(adminLeavePage.leaveListTable).not.toBeVisible()

        })

    })

    test('Admin rejects the employees leave', async ({
        adminDashboardPage, adminLeavePage , adminPimPage , 
        employeeDashboardPage, employeeLeavePage,employeeLoginPage,employeePages
    })=>{

        test.setTimeout(3*60*1000)

        await test.step('Employee logins',async()=>{
            // await this.employeeLoginPage.pause()
            await employeeLoginPage.login(employeeData.username,employeeData.password);
        })        
               
       
        await test.step('admin adds leave entitlements for employee',async()=>{
            await expect(employeePages).toHaveURL(/dashboard/);
            await adminDashboardPage.navigateToLeave();
            await adminLeavePage.navigateToEntitlementsAndAddEntitlements()
            
            await adminLeavePage.fillEntitlementForm(employeeData.employeeFullName,leaveType,leavePeriod,entitlement,formatLeavePeriod)

            await adminLeavePage.confirmEntitlementSave()
        })

        await test.step('Employee applies for the leave',async()=>{
            await employeeDashboardPage.navigateToLeave()
            await employeeLeavePage.navigateToApplyLeave()
            await employeeLeavePage.applyLeave(leaveType,fromDate,toDate,comment)
        })

        await test.step('Admin finds the leave', async()=>{
            await adminLeavePage.navigateToLeaveList()
            await adminLeavePage.searchWithEmployeeName(employeeData.employeeFullName)  
            
            await expect(adminLeavePage.leaveListTable).toBeVisible()

        })

        await test.step('Admin Rejects the leave', async()=>{
            await adminLeavePage.rejectEmployeesLeave(employeeData.employeeFullName)
            await adminLeavePage.searchWithEmployeeName(employeeData.employeeFullName)

            await expect(adminLeavePage.toast.last()).toHaveText('No Records Found')
        })

        await test.step('Employee Verifies the Result',async()=>{
            await employeeLeavePage.navigateToMyLeave()
            console.log(await employeeLeavePage.getTableData())
            expect((await employeeLeavePage.getTableData())[0].Status).toContain('Rejected')
        })

    })

});
