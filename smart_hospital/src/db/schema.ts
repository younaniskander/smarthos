import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patient table - stores patient information
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  patientId: varchar("patientId", { length: 64 }).notNull().unique(), // Medical record number
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  medicalHistory: text("medicalHistory"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Analysis Results table - stores all diagnostic analysis results
 */
export const analysisResults = mysqlTable("analysisResults", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(), // Foreign key to patients
  doctorId: int("doctorId").notNull(), // Foreign key to users (doctor)
  analysisType: mysqlEnum("analysisType", ["brain_tumor", "chest_disease", "bone_fracture", "lung_cancer"]).notNull(),
  diagnosis: text("diagnosis").notNull(),
  confidenceScore: decimal("confidenceScore", { precision: 5, scale: 4 }).notNull(), // 0.0000 to 1.0000
  imageUrl: text("imageUrl"), // URL to uploaded medical image
  riskFactors: text("riskFactors"), // JSON string for lung cancer risk factors
  modelOutput: text("modelOutput"), // Raw model output/predictions
  notes: text("notes"), // Doctor's additional notes
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = typeof analysisResults.$inferInsert;

/**
 * Brain Tumor Analysis - specialized table for brain tumor detection
 */
export const brainTumorAnalysis = mysqlTable("brainTumorAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  analysisResultId: int("analysisResultId").notNull(), // Foreign key to analysisResults
  tumorType: varchar("tumorType", { length: 255 }),
  tumorLocation: varchar("tumorLocation", { length: 255 }),
  tumorSize: varchar("tumorSize", { length: 100 }),
  malignancyScore: decimal("malignancyScore", { precision: 5, scale: 4 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrainTumorAnalysis = typeof brainTumorAnalysis.$inferSelect;
export type InsertBrainTumorAnalysis = typeof brainTumorAnalysis.$inferInsert;

/**
 * Chest Disease Analysis - specialized table for chest disease detection
 */
export const chestDiseaseAnalysis = mysqlTable("chestDiseaseAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  analysisResultId: int("analysisResultId").notNull(), // Foreign key to analysisResults
  diseaseType: varchar("diseaseType", { length: 255 }),
  affectedArea: varchar("affectedArea", { length: 255 }),
  severity: mysqlEnum("severity", ["mild", "moderate", "severe"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChestDiseaseAnalysis = typeof chestDiseaseAnalysis.$inferSelect;
export type InsertChestDiseaseAnalysis = typeof chestDiseaseAnalysis.$inferInsert;

/**
 * Bone Fracture Analysis - specialized table for bone fracture detection
 */
export const boneFractureAnalysis = mysqlTable("boneFractureAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  analysisResultId: int("analysisResultId").notNull(), // Foreign key to analysisResults
  boneType: varchar("boneType", { length: 255 }),
  fractureType: varchar("fractureType", { length: 255 }),
  fractureLocation: varchar("fractureLocation", { length: 255 }),
  complexity: mysqlEnum("complexity", ["simple", "compound", "comminuted"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BoneFractureAnalysis = typeof boneFractureAnalysis.$inferSelect;
export type InsertBoneFractureAnalysis = typeof boneFractureAnalysis.$inferInsert;

/**
 * Lung Cancer Analysis - specialized table for lung cancer detection
 */
export const lungCancerAnalysis = mysqlTable("lungCancerAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  analysisResultId: int("analysisResultId").notNull(), // Foreign key to analysisResults
  smokingStatus: mysqlEnum("smokingStatus", ["never", "former", "current"]),
  packYears: int("packYears"),
  age: int("age"),
  familyHistory: boolean("familyHistory").default(false),
  exposureHistory: text("exposureHistory"),
  riskScore: decimal("riskScore", { precision: 5, scale: 4 }),
  cancerProbability: decimal("cancerProbability", { precision: 5, scale: 4 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LungCancerAnalysis = typeof lungCancerAnalysis.$inferSelect;
export type InsertLungCancerAnalysis = typeof lungCancerAnalysis.$inferInsert;

/**
 * Relations for better query capabilities
 */
export const usersRelations = relations(users, ({ many }) => ({
  analysisResults: many(analysisResults),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  analysisResults: many(analysisResults),
}));

export const analysisResultsRelations = relations(analysisResults, ({ one, many }) => ({
  patient: one(patients, {
    fields: [analysisResults.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [analysisResults.doctorId],
    references: [users.id],
  }),
  brainTumor: one(brainTumorAnalysis),
  chestDisease: one(chestDiseaseAnalysis),
  boneFracture: one(boneFractureAnalysis),
  lungCancer: one(lungCancerAnalysis),
}));

export const brainTumorAnalysisRelations = relations(brainTumorAnalysis, ({ one }) => ({
  analysisResult: one(analysisResults, {
    fields: [brainTumorAnalysis.analysisResultId],
    references: [analysisResults.id],
  }),
}));

export const chestDiseaseAnalysisRelations = relations(chestDiseaseAnalysis, ({ one }) => ({
  analysisResult: one(analysisResults, {
    fields: [chestDiseaseAnalysis.analysisResultId],
    references: [analysisResults.id],
  }),
}));

export const boneFractureAnalysisRelations = relations(boneFractureAnalysis, ({ one }) => ({
  analysisResult: one(analysisResults, {
    fields: [boneFractureAnalysis.analysisResultId],
    references: [analysisResults.id],
  }),
}));

export const lungCancerAnalysisRelations = relations(lungCancerAnalysis, ({ one }) => ({
  analysisResult: one(analysisResults, {
    fields: [lungCancerAnalysis.analysisResultId],
    references: [analysisResults.id],
  }),
}));