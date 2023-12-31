describe('Auth', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'Abc1234!',
      role: 'user',
    };
    await fetch('http://auth:3000/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  test('should return a JWT when logging in', async () => {
    const user = {
      email: 'test@test.com',
      password: 'Abc1234!',
    };
    const response = await fetch('http://auth:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('accessToken');
    jwt = data.data.accessToken;
  });

  test('should return a 404 when trying to register a user with non existing email', async () => {
    const user = {
      email: 'demoUser@test.com',
      password: 'Abc1234!',
    };
    const response = await fetch('http://auth:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toBe(404);
  });

  test('should return invalid credentials when logging in with invalid credentials', async () => {
    const user = {
      email: 'test@test.com',
      password: 'Abc1235!',
    };
    const response = await fetch('http://auth:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Invalid credentials.');
  });

  test('should return a 401 when trying to access a protected route without a JWT', async () => {
    const response = await fetch('http://user:3009/user/me');
    expect(response.status).toBe(403);
  });

  test('should return a 200 when trying to access a protected route with a JWT', async () => {
    const response = await fetch('http://user:3009/user/me', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    expect(response.status).toBe(200);
  });
});
