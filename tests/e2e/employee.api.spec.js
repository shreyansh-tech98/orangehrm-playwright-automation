import { test, expect } from '../../fixtures/apiFixtures.js';

test.describe('Employee API', () => {
  
  test('should fetch employees via browser API', async ({ page }) => {
    // Step 1: Go to PIM page (establishes full browser session)
    await page.goto('/pim/viewEmployeeList');
    
    // Step 2: Call internal API using browser's authenticated session
    const employees = await page.evaluate(async () => {
      const res = await fetch('/web/index.php/api/v2/pim/employees?limit=50&offset=0&sortField=employee.firstName&sortOrder=ASC', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      return res.json();
    });
    
    console.log('Employee count:', employees.data.length);
    expect(employees.data).toBeDefined();
    expect(employees.meta.total).toBeGreaterThan(0);
  });

  test('should add employee via API', async ({ page }) => {
    await page.goto('/pim/viewEmployeeList');
    
    const result = await page.evaluate(async () => {
      const res = await fetch('/web/index.php/api/v2/pim/employees', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'API',
          lastName: 'Test',
          middleName: '',
          employeeId: String(Date.now()).slice(-5),
        }),
      });
      return res.json();
    });
    
    console.log('Added employee:', result.data.empNumber);
    expect(result.data.empNumber).toBeDefined();
  });

});