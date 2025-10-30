import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("API endpoints", () => {

  describe("Error handling", () => {
    beforeAll(() => {
      process.env.NODE_ENV = "test";
    });

    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/non-existent");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Not Found" });
    });

    it("should handle server errors", async () => {
      const response = await request(app).get("/api/error-test");
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
        message: "Test error",
      });
    });
  });

  describe("GET /api/health", () => {
    it("should return status 200 and ok status", async () => {
      const response = await request(app).get("/api/health");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: "ok",
    time: expect.any(String),
      });
    });
  });
});