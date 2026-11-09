import { describe, expect, it, vi } from "vitest";
import { authorizeRole } from "../src/middleware/authorizeRole.js";

describe("authorizeRole", () => {
  it("should allow ADMIN when ADMIN role is required", () => {
    // Arrange
    const req = {
      user: { id: 1, role: "ADMIN" },
    };
    const next = vi.fn();

    // Act
    const middleware = authorizeRole("ADMIN");
    middleware(req, {}, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("should reject USER when ADMIN role is required", () => {
    // Arrange
    const req = {
      user: { id: 2, role: "USER" },
    };
    const next = vi.fn();

    // Act
    const middleware = authorizeRole("ADMIN");
    middleware(req, {}, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Forbidden");
  });

  it("should allow USER when USER role is required", () => {
    // Arrange
    const req = {
      user: { id: 2, role: "USER" },
    };
    const next = vi.fn();

    // Act
    const middleware = authorizeRole("USER");
    middleware(req, {}, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("should allow multiple authorized roles", () => {
    // Arrange
    const req = {
      user: { id: 1, role: "ADMIN" },
    };
    const next = vi.fn();

    // Act
    const middleware = authorizeRole("ADMIN", "USER");
    middleware(req, {}, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("should return 401 when req.user is missing", () => {
    // Arrange
    const req = {};
    const next = vi.fn();

    // Act
    const middleware = authorizeRole("ADMIN");
    middleware(req, {}, next);

    // Assert
    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Authentication required");
  });

  it("should throw an error when no roles are provided", () => {
    // Act & Assert
    expect(() => authorizeRole()).toThrow(
      "Invalid authorization role configuration",
    );
  });

  it("should throw an error when an invalid role is provided", () => {
    // Act & Assert
    expect(() => authorizeRole("ADMNI")).toThrow(
      "Invalid authorization role configuration",
    );
  });
});
