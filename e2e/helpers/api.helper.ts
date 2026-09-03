import type { APIRequestContext } from '@playwright/test';

const apiBaseUrl =
  process.env.PUBLIC_API_URL ?? 'http://localhost:4000';

const adminEmail =
  process.env.QA_UPSKILL_ADMIN_EMAIL ?? 'admin@qaupskill.local';

const adminPassword =
  process.env.QA_UPSKILL_ADMIN_PASSWORD;

if (!adminPassword) {
  throw new Error(
    'QA_UPSKILL_ADMIN_PASSWORD environment variable is required',
  );
}

export type TestUser = {
  fullName: string;
  email: string;
  password: string;
  role: 'User';
};

type LoginResponse = {
  token: string;
};

type CreatedUserResponse = {
  id: number;
};

export async function getAdminToken(
  request: APIRequestContext,
): Promise<string> {
  const response = await request.post(`${apiBaseUrl}/auth/login`, {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });
  

  if (!response.ok()) {
    throw new Error(
      `Admin login failed with status ${response.status()}`,
    );
  }

  const responseBody = (await response.json()) as LoginResponse;

  return responseBody.token;
}

export async function createUserViaApi(
  request: APIRequestContext,
  adminToken: string,
  user: TestUser,
): Promise<number> {
  const response = await request.post(`${apiBaseUrl}/people`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    data: user,
  });

  if (!response.ok()) {
    throw new Error(
      `User creation failed with status ${response.status()}`,
    );
  }

  const responseBody =
    (await response.json()) as CreatedUserResponse;

  return responseBody.id;
}

export async function deleteUserViaApi(
  request: APIRequestContext,
  adminToken: string,
  userId: number,
): Promise<void> {
  const response = await request.delete(
    `${apiBaseUrl}/people/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    },
  );

  if (response.status() !== 204 && response.status() !== 404) {
    throw new Error(
      `User deletion failed with status ${response.status()}`,
    );
  }
}