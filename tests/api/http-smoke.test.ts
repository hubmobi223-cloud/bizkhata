import { describe, expect, it } from "vitest";
import request from "supertest";

const baseUrl = process.env.E2E_BASE_URL;

// Integration smoke tests against a running server (npm run dev / start).
// Set E2E_BASE_URL=http://localhost:3000 (and disable middleware if needed)
// to execute real HTTP-level checks: npm run test:api.
describe.skipIf(!baseUrl)("HTTP smoke", () => {
  const app = baseUrl!;

  it("redirects unauthenticated users on protected routes to sign-in", async () => {
    for (const path of ["/", "/ledgers", "/vouchers", "/items", "/billing"]) {
      const res = await request(app).get(path).redirects(0);
      expect(res.status).toBe(307);
      expect(res.headers.location).toMatch(/\/auth\/sign-in/);
    }
  });

  it("serves the auth page", async () => {
    const res = await request(app).get("/auth/sign-in");
    expect(res.status).toBe(200);
  });
});