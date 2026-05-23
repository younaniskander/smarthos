import { z } from "zod";
import { protectedProcedure, router } from "../../_core/trpc";
import fs from "fs";
import path from "path";
import {
  createPatient,
  getPatientByPatientId,
  getPatientById,
  getAllPatients,
  deletePatient,
  createAnalysisResult,
  getAnalysisResultsByPatientId,
  getAllAnalysisResults,
  getDb,
} from "../../db";
import { analysisResults, brainTumorAnalysis } from "../../db/schema";


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

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePatient(input.id);
      return { success: true };
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

  analyzeBrainTumor: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        imageName: z.string().optional(),
        imageBase64: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("User not authenticated");

      console.log(`Running brain tumor analysis for patient ID: ${input.patientId}...`);

      const patient = await getPatientByPatientId(input.patientId);
      if (!patient) {
        throw new Error(`Patient with record ID "${input.patientId}" not found. Please register the patient first.`);
      }

      try {
        const buffer = Buffer.from(input.imageBase64.split(",")[1] || input.imageBase64, 'base64');
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', blob, input.imageName || 'mri.jpg');

        const mlResponse = await fetch('http://127.0.0.1:8000/predict/brain_tumor', {
          method: 'POST',
          body: formData,
        });

        if (!mlResponse.ok) {
          const errMsg = await mlResponse.text();
          throw new Error(`ML Service error: ${errMsg}`);
        }

        const mlResult = await mlResponse.json();
        console.log("ML Service result:", mlResult);

        // Save base64 image locally to prevent database TEXT size limits (64KB)
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const fileExt = input.imageName ? path.extname(input.imageName) : ".jpg";
        const fileName = `brain_tumor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;
        const filePath = path.join(uploadsDir, fileName);
        const base64Data = input.imageBase64.split(",")[1] || input.imageBase64;
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        const imageUrl = `/uploads/${fileName}`;

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [insertedResult] = await db.insert(analysisResults).values({
          patientId: patient.id,
          doctorId: ctx.user.id,
          analysisType: "brain_tumor",
          diagnosis: mlResult.diagnosis,
          confidenceScore: mlResult.confidence.toFixed(4),
          imageUrl,
          modelOutput: JSON.stringify(mlResult.rawBoxes),
          notes: input.notes || "",
        });

        const analysisResultId = insertedResult.insertId;

        await db.insert(brainTumorAnalysis).values({
          analysisResultId,
          tumorType: mlResult.tumorType,
          tumorLocation: mlResult.tumorLocation,
          tumorSize: mlResult.tumorSize,
          malignancyScore: mlResult.malignancyScore.toFixed(4),
        });

        return {
          success: true,
          analysisResultId,
          diagnosis: mlResult.diagnosis,
          confidence: mlResult.confidence,
          tumorType: mlResult.tumorType,
          tumorLocation: mlResult.tumorLocation,
          tumorSize: mlResult.tumorSize,
          malignancyScore: mlResult.malignancyScore,
        };

      } catch (err: any) {
        console.error("Failed to analyze brain tumor:", err);
        throw new Error(`Brain tumor analysis failed: ${err.message}`);
      }
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

