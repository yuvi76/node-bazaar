import { ping } from 'tcp-ping';

describe('HealthCheck', () => {
  test('Auth', async () => {
    const response = await fetch('http://auth:3000/api');
    expect(response.ok).toBeTruthy();
  });

  test('Auth TCP', (done) => {
    ping({ address: 'auth', port: 3001 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test('Category', async () => {
    const response = await fetch('http://category:3002/api');
    expect(response.ok).toBeTruthy();
  });

  test('Product', async () => {
    const response = await fetch('http://product:3003/api');
    expect(response.ok).toBeTruthy();
  });

  test('Product TCP', (done) => {
    ping({ address: 'product', port: 3004 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test('Cart', async () => {
    const response = await fetch('http://cart:3005/api');
    expect(response.ok).toBeTruthy();
  });

  test('Payments', (done) => {
    ping({ address: 'payments', port: 3006 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test('Orders', async () => {
    const response = await fetch('http://orders:3007/api');
    expect(response.ok).toBeTruthy();
  });

  test('Reviews', async () => {
    const response = await fetch('http://reviews:3008/api');
    expect(response.ok).toBeTruthy();
  });

  test('User', async () => {
    const response = await fetch('http://user:3009/api');
    expect(response.ok).toBeTruthy();
  });
});
