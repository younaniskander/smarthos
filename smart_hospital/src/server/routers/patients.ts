import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createPatient,
  getPatientByPatientId,
  getPatientById,
  getAllPatients,
  createAnalysisResult,
  getAnalysisResultsByPatientId,
  getAllAnalysisResults,
} from "../db";

export const patientsRouter = router({
  // Patient Management
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.date().optional(),
        medicalHistory: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createPatient(input);
      return { success: true, patientId: input.patientId };
    }),

  getByPatientId: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ input }) => {
      return await getPatientByPatientId(input.patientId);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getPatientById(input.id);
    }),

  list: protectedProcedure.query(async () => {
    return await getAllPatients();
  }),

  // Analysis Results
  createAnalysis: protectedProcedure
    .input(
      z.object({
        patientId: z.number(),
        analysisType: z.enum(["brain_tumor", "chest_disease", "bone_fracture", "lung_cancer"]),
        diagnosis: z.string(),
        confidenceScore: z.number().min(0).max(1),
        imageUrl: z.string().optional(),
        riskFactors: z.string().optional(),
        modelOutput: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("User not authenticated");

      const result = await createAnalysisResult({
        patientId: input.patientId,
        doctorId: ctx.user.id,
        analysisType: input.analysisType,
        diagnosis: input.diagnosis,
        confidenceScore: input.confidenceScore as any,
        imageUrl: input.imageUrl,
        riskFactors: input.riskFactors,
        modelOutput: input.modelOutput,
        notes: input.notes,
      });

      return { success: true };
    }),

  getAnalysisByPatientId: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await getAnalysisResultsByPatientId(input.patientId);
    }),

  listAllAnalysis: protectedProcedure.query(async () => {
    return await getAllAnalysisResults();
  }),
});

