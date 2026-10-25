import { test, expect } from '../../fixtures/testFixtures';
import { faker } from '@faker-js/faker';

test.describe.serial('check the admin flow', async () => {
  let userInputs;

  test.beforeAll(async () => {
    let username;

    do {
      username = faker.person.firstName();
    } while (username.length < 5);

    const password = username + '@2026';

    userInputs = { username: username, password: password };
  });

  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateTo('/web/index.php/dashboard/index');
    await dashboardPage.navigateToAdmin();
  });

  test('fill user details and save them', async ({ adminPage }) => {
    await adminPage.clickAddUser();
    const asume = ['Ar','Jo','Ma','An','Sa','Ra','Sh','Vi','Ka','Li','Na','Pa','Ra','Sa','Ta','Va','Wa','Ya','Za']    

    for (const name of asume){
      await adminPage.employeeName.clear()
      await adminPage.employeeName.type(name, {delay: 2000})

      try {
        const options = await adminPage.findOption.allTextContents()               
        
        if (options){
          const employeeName = options[0]
          await adminPage.fillUserDetails('Ess',employeeName,'Enabled',
              userInputs.username,
              userInputs.password
            );
         } 
      break

    }catch{
      await adminPage.page.waitForTimeout(2000)
      
    }    

  }

  });

  test('seach by username', async ({ adminPage }) => {
    await adminPage.searchUserByUsername(userInputs.username);
    await expect(adminPage.userTableRows).toHaveCount(2);
  });

  test('delete by username', async ({ adminPage }) => {
    await adminPage.searchUserByUsername(userInputs.username);
    await expect(adminPage.userTableRows).toHaveCount(2);
    await adminPage.deleteUserByUsername(userInputs.username);

    await expect(adminPage.toastMassege.last()).toHaveText('No Records Found');

    await expect(adminPage.userTableRows).toHaveCount(1);
  });
});
