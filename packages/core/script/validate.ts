#!/usr/bin/env bun

import path from "node:path";
import { ZodError } from "zod";

import { generate } from "../src/generate";

const jsonIndent = 2;
const failure = 1;

try {
  const result = await generate(path.join(import.meta.dirname, "..", "..", "..", "clients"));
  console.log(JSON.stringify(result, null, jsonIndent));
} catch (error) {
  if (error instanceof ZodError) {
    console.error("Validation error:", error.errors);
    console.error("When parsing:", error.cause);
    process.exit(failure);
  }
  throw error;
}
