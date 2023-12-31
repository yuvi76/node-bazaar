describe('Category', () => {
  let jwt: string;
  let categoryId: string;

  beforeAll(async () => {
    const user = {
      name: 'Test User',
      email: 'admin@test.com',
      password: 'Abc1234!',
      role: 'admin',
    };
    await fetch('http://auth:3000/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
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

  test('should return a 201 when creating a new category', async () => {
    const category = {
      name: 'Test Category',
      description: 'Test Category Description',
    };
    const response = await fetch('http://category:3002/category', {
      method: 'POST',
      body: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    expect(data.statusCode).toBe(201);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('name');
    expect(data.data).toHaveProperty('description');
    categoryId = data.data._id;
  });

  test('should return a 409 when creating a category that already exists', async () => {
    const category = {
      name: 'Test Category',
      description: 'Test Category Description',
    };
    const response = await fetch('http://category:3002/category', {
      method: 'POST',
      body: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    expect(data.statusCode).toBe(409);
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Category with the same name already exists.');
  });

  test('should return a 200 when getting all categories', async () => {
    const response = await fetch('http://category:3002/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveLength(1);
  });

  test('should return a 200 when getting a category by ID', async () => {
    const response = await fetch(
      `http://category:3002/category/${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('name');
    expect(data.data).toHaveProperty('description');
  });

  test('should return a 404 when getting a category by ID that does not exist', async () => {
    const response = await fetch(
      'http://category:3002/category/5f8e1d1d2d7e5b2e1c4c8d9c',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(404);
  });

  test('should return a 200 when updating a category', async () => {
    const category = {
      name: 'Test Category Updated',
      description: 'Test Category Description Updated',
    };
    const response = await fetch(
      `http://category:3002/category/${categoryId}`,
      {
        method: 'POST',
        body: JSON.stringify(category),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('name');
    expect(data.data).toHaveProperty('description');
  });

  test('should return a 404 when updating a category that does not exist', async () => {
    const category = {
      name: 'Test Category Updated',
      description: 'Test Category Description Updated',
    };
    const response = await fetch(
      'http://category:3002/category/5f8e1d1d2d7e5b2e1c4c8d9c',
      {
        method: 'POST',
        body: JSON.stringify(category),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(404);
  });

  test('should return a 200 when deleting a category', async () => {
    const response = await fetch(
      `http://category:3002/category/delete/${categoryId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Category deleted successfully.');
  });

  test('should return a 404 when deleting a category that does not exist', async () => {
    const response = await fetch(
      'http://category:3002/category/delete/5f8e1d1d2d7e5b2e1c4c8d9c',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response.json();
    expect(data.statusCode).toBe(404);
  });

  test('should return a 403 when trying to create a category without a JWT', async () => {
    const category = {
      name: 'Test Category',
      description: 'Test Category Description',
    };
    const response = await fetch('http://category:3002/category', {
      method: 'POST',
      body: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(403);
  });

});
