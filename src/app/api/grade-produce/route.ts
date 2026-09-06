import { NextRequest } from "next/server";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

const GRADES = ["A_PLUS", "A", "B", "C"] as const;

interface GradeResult {
  grade: typeof GRADES[number];
  qualityScore: number;
  colorUniformity: number;
  surfaceDefects: number;
  freshnessScore: number;
  confidence: number;
  suggestedPriceAdjustment: number;
  recommendations: string[];
}

function mockGradeAnalysis(fileSize: number): GradeResult {
  const random = Math.random();

  let grade: typeof GRADES[number];
  let qualityScore: number;
  let colorUniformity: number;
  let surfaceDefects: number;
  let freshnessScore: number;

  if (random < 0.25) {
    grade = "A_PLUS";
    qualityScore = 92 + Math.floor(Math.random() * 8);
    colorUniformity = 90 + Math.floor(Math.random() * 10);
    surfaceDefects = 2 + Math.floor(Math.random() * 3);
    freshnessScore = 90 + Math.floor(Math.random() * 10);
  } else if (random < 0.5) {
    grade = "A";
    qualityScore = 82 + Math.floor(Math.random() * 8);
    colorUniformity = 80 + Math.floor(Math.random() * 10);
    surfaceDefects = 5 + Math.floor(Math.random() * 5);
    freshnessScore = 80 + Math.floor(Math.random() * 10);
  } else if (random < 0.75) {
    grade = "B";
    qualityScore = 70 + Math.floor(Math.random() * 10);
    colorUniformity = 65 + Math.floor(Math.random() * 15);
    surfaceDefects = 10 + Math.floor(Math.random() * 10);
    freshnessScore = 65 + Math.floor(Math.random() * 15);
  } else {
    grade = "C";
    qualityScore = 50 + Math.floor(Math.random() * 15);
    colorUniformity = 45 + Math.floor(Math.random() * 20);
    surfaceDefects = 20 + Math.floor(Math.random() * 15);
    freshnessScore = 40 + Math.floor(Math.random() * 20);
  }

  const recommendations: string[] = [];
  if (grade === "A_PLUS") {
    recommendations.push("Premium quality - suggest pricing at market premium");
    recommendations.push("Suitable for retail and export markets");
  } else if (grade === "A") {
    recommendations.push("Good quality - standard market pricing applicable");
    recommendations.push("Suitable for retail markets");
  } else if (grade === "B") {
    recommendations.push("Moderate quality - consider processing or value-added products");
    recommendations.push("May require sorting to improve grade");
  } else {
    recommendations.push("Lower quality - consider processing or local market sale");
    recommendations.push("Inspect for freshness and consider immediate sale");
  }

  const priceMultipliers: Record<string, number> = {
    A_PLUS: 1.2,
    A: 1.0,
    B: 0.8,
    C: 0.6,
  };

  return {
    grade,
    qualityScore,
    colorUniformity,
    surfaceDefects,
    freshnessScore,
    confidence: 85 + Math.floor(Math.random() * 15),
    suggestedPriceAdjustment: Math.round((priceMultipliers[grade] - 1) * 100),
    recommendations,
  };
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "FARMER" && auth.user.role !== "ADMIN") {
      return errorResponse("Only farmers can grade produce", 403);
    }

    let imageSize = 0;
    let imageData: string | null = null;

    try {
      const formData = await request.formData();
      const image = formData.get("image") as File | null;
      if (image) {
        imageSize = image.size;
        const buffer = Buffer.from(await image.arrayBuffer());
        imageData = `data:${image.type};base64,${buffer.toString("base64")}`;
      }
    } catch {
      // If not multipart, allow direct JSON grading
    }

    if (!imageData) {
      try {
        const body = await request.json();
        if (body.imageUrl) imageData = body.imageUrl;
      } catch {}
    }

    if (!imageData) {
      return errorResponse("Produce image is required");
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = mockGradeAnalysis(imageSize);

    return successResponse(result);
  } catch (error: any) {
    console.error("Grading error:", error);
    return errorResponse("Grading failed: " + error.message, 500);
  }
}
