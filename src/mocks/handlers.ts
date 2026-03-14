import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Basic test endpoint
  http.get('/api/test', async () => {
    await delay(200);

    return HttpResponse.json({
      success: true,
      message: 'MSW is working!',
      timestamp: new Date().toISOString(),
      data: {
        environment: 'development',
        mock: true,
      },
    });
  }),

  // Simple auth login mock
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500);

    const { email, password } = (await request.json()) as { email: string; password: string };

    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          user: { id: 1, name: 'Admin User', email },
          token: 'mock-jwt-token',
        },
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 },
    );
  }),
];
