import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define student table schema
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  section: text("section").notNull(),
  house: text("house").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define house enum for validation
export const studentHouseEnum = z.enum(["Shivaji", "Tagore", "Ashoka", "Raman"]);

// Create schema for inserting a student
export const insertStudentSchema = createInsertSchema(students, {
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  class: z.string().min(1, { message: "Please select a class" }),
  section: z.string().min(1, { message: "Please select a section" }),
  house: studentHouseEnum,
  phone: z.string().min(10, { message: "Please enter a valid phone number" }).optional(),
  notes: z.string().optional(),
}).omit({ id: true, createdAt: true });

// Type definitions
export type StudentHouse = z.infer<typeof studentHouseEnum>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// User table for auth (using the existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
