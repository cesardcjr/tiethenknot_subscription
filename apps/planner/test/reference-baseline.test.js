import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("planner baseline retains all reference planning modules", () => {
  const pages = fs.readdirSync(path.resolve("src/pages"));
  for (const page of ["Dashboard.jsx", "Guests.jsx", "Expenses.jsx", "Tasks.jsx", "Checklist.jsx", "Suppliers.jsx", "Program.jsx", "Seating.jsx", "AdminUsers.jsx"]) {
    assert.ok(pages.includes(page), `${page} is required for reference parity`);
  }
});
