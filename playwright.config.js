import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // The tests share one database, so running them serially prevents data races.
  workers: 1,

  use: {
    baseURL: "http://localhost:3001",
  },

  webServer: {
    command: "node src/server.js",
    env: {
      PORT: "3001",
    },
    url: "http://localhost:3001/api/books",
    reuseExistingServer: false,
  },
});
