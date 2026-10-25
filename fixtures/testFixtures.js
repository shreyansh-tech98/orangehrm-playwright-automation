import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

import { PIMPage } from '../pages/PIMPage';
import { AdminPage } from '../pages/AdminPage';
import {AdminLeavePage} from '../pages/AdminLeavePage'
import { EmployeeDashboardPage } from '../pages/EmployeeDashboardPage';
import { EmployeeLeavePage } from '../pages/EmployeeLeavePage';


export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  pimPage: async ({ page }, use) => {
    const pimPage = new PIMPage(page);
    await use(pimPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  adminPages : async({browser},use)=>{

    const context = await browser.newContext({storageState:"config/.auth/user.json"})
    const page = await context.newPage()

    await use(page)
    await context.close()

  },
  employeePages:async({browser},use)=>{
    const context = await browser.newContext({storageState:undefined})
    const page = await context.newPage()

    await use(page)
    await context.close()
  },
  
   adminDashboardPage: async ({ adminPages }, use) => {

        const dashboardPage = new DashboardPage(adminPages);

        await use(dashboardPage);
    },

   adminPimPage: async ({ adminPages }, use) => {

        const pimPage = new PIMPage(adminPages);

        await use(pimPage);
    },
    adminLeavePage: async({adminPages},use)=>{
        const leavePage = new AdminLeavePage(adminPages);
        await use(leavePage);
    },
    employeeLoginPage: async ({ employeePages }, use) => {

        const loginPage = new LoginPage(employeePages);

        await use(loginPage);
    },
    employeeDashboardPage: async ({ employeePages }, use) => {
        const dashboardPage = new EmployeeDashboardPage(employeePages);
        await use(dashboardPage);
    },
    employeeLeavePage:async({employeePages},use)=>{
        const leavePage = new EmployeeLeavePage(employeePages);
        await use(leavePage);
    }

});

export { expect } 
