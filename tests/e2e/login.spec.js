import { test, expect } from '../../fixtures/testFixtures.js';
import users from '../../test-data/users.json';

test.describe('Verify the login features', async () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(`/web/index.php/auth/login`);
  });

  test('Login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(users.validAdmin.username, users.validAdmin.password);
    await expect(loginPage.page).toHaveURL(/dashboard/);
    await dashboardPage.logout();
  });

  test('login with valid user with invalid password', async ({ loginPage }) => {
    const user = users.invalidUsers[0];
    await loginPage.login(user.username, user.password);
    await loginPage.isLoginPageDisplayed();
    await expect(loginPage.errorMessage).toHaveText(user.expectedError);
  });

  test('login with empty user name with valid password', async ({ loginPage }) => {
    const user = users.invalidUsers[1];
    await loginPage.login(user.username, user.password);
    await loginPage.isLoginPageDisplayed();
    await expect(loginPage.passwordError).toHaveText(user.expectedError);
  });

  test('login with username with empty password', async ({ loginPage }) => {
    const user = users.invalidUsers[2];
    await loginPage.login(user.username, user.password);
    await loginPage.isLoginPageDisplayed();
    await expect(loginPage.passwordError).toHaveText(user.expectedError);
  });
});
