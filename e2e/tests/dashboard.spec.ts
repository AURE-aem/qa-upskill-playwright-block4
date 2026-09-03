import { test, expect } from '../fixtures/test.fixture';
import {
  createUserViaApi,
  deleteUserViaApi,
  getAdminToken,
  type TestUser,
} from '../helpers/api.helper';

const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

const testUser: TestUser = {
  fullName: `Block 4 User ${uniqueSuffix}`,
  email: `block4-${uniqueSuffix}@qaupskill.local`,
  password: 'User12345!',
  role: 'User',
};

let adminToken = '';
let testUserId: number | undefined;

test.describe('Dashboard login', () => {
  test.beforeAll(async ({ request }) => {
    adminToken = await getAdminToken(request);

    testUserId = await createUserViaApi(
      request,
      adminToken,
      testUser,
    );
  });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();

    await loginPage.login(
      testUser.email,
      testUser.password,
    );
  });

  test('dashboard loads after login @smoke', async ({ page }) => {
    await test.step('Verify authenticated dashboard is visible', async () => {
      await expect(
        page.getByRole('heading', { name: testUser.fullName }),
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: 'Logout' }),
      ).toBeVisible();
    });
  });

  test.afterAll(async ({ request }) => {
    if (testUserId !== undefined && adminToken !== '') {
      await deleteUserViaApi(
        request,
        adminToken,
        testUserId,
      );
    }
  });
});
