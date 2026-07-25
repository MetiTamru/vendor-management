process.env.SKIP_ENV_VALIDATION = "true";
process.env.NEXT_PUBLIC_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

// Admin list APIs use mocks in unit tests (see *.query.test.ts)
process.env.NEXT_PUBLIC_USE_MOCK_GROUPS = "true";
process.env.NEXT_PUBLIC_USE_MOCK_USERS = "true";
process.env.NEXT_PUBLIC_USE_MOCK_ROLES = "true";
process.env.NEXT_PUBLIC_USE_MOCK_SETTINGS = "true";
