// tests/e2e/pim.spec.js
import { test, expect } from '../../fixtures/testFixtures.js';
import { faker } from '@faker-js/faker';

test.describe('PIM Employee Management', () => {
  const employeData = {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    employeeId: String(faker.number.int({ min: 10000, max: 99999 })),
    fullName: function () {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    },
  };

  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateTo('/web/index.php/dashboard/index');
    await dashboardPage.navigateToPIM();
  });

  test('should add new employee @smoke', async ({ dashboardPage, pimPage }) => {
    // add the employee
    await pimPage.clickAddEmployee();

    await pimPage.addEmployee(
      employeData.firstName,
      employeData.middleName,
      employeData.lastName,
      employeData.employeeId
    );

    await pimPage.createEmployeeLoginDetails(employeData.firstName,employeData.firstName+'@123')

    await expect(pimPage.successToast).toHaveText('Successfully Saved');

    await pimPage.navigateToEmployeeList();
    // Search the Employee with added one
    await pimPage.searchEmployeeByName(employeData.fullName());

    await expect(pimPage.employeeTableRows).toHaveCount(2);

    await pimPage.navigateToEmployeeList();

    // search and delete the employee from added one
    await pimPage.searchEmployeeByName(employeData.fullName());

    await pimPage.deleteEmployeeByName(employeData.fullName().split(' ').splice(0, 2).join(' '));

    // re-search and check the employee should not exist

    await expect(pimPage.successToast).toHaveText('Successfully Deleted');
  });

});
