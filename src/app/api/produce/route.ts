import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { calculateDistance } from "@/lib/utils";
import { rankProduceList } from "@/lib/ranking";
import { produceSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const category = searchParams.get("category") || undefined;
    const grade = searchParams.get("grade") || undefined;
    const distance = searchParams.get("distance") ? parseFloat(searchParams.get("distance")!) : undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const organic = searchParams.get("organic") === "true";
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "rank";
    const myProduce = searchParams.get("myProduce") === "true";
    const all = searchParams.get("all") === "true";

    const where: any = { status: "ACTIVE" };

    if (all) delete where.status;

    if (category) where.category = category;
    if (grade) where.grade = grade;
    if (minPrice) where.price = { ...(where.price || {}), gte: minPrice };
    if (maxPrice) where.price = { ...(where.price || {}), lte: maxPrice };
    if (organic) where.organic = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { farmer: { user: { name: { contains: search, mode: "insensitive" } } } },
        { farmer: { district: { contains: search, mode: "insensitive" } } },
      ];
    }

    let produce = await prisma.produce.findMany({
      where,
      include: {
        farmer: {
          include: { user: { select: { name: true, avatar: true } } },
        },
        images: true,
        gradeDetail: true,
        reviews: true,
      },
      orderBy: myProduce ? { createdAt: "desc" } : undefined,
    });

    if (all) {
      const auth = await requireAuth(request);
      if (!auth.user) return auth.error;
      if (auth.user.role !== "ADMIN") {
        return errorResponse("Admin access required", 403);
      }
    }

    if (myProduce) {
      const auth = await requireAuth(request);
      if (!auth.user) {
        return errorResponse("Authentication required", 401);
      }
      const farmer = auth.user.farmer;
      if (!farmer) return errorResponse("Only farmers can view their produce", 403);
      produce = produce.filter((p) => p.farmerId === farmer.id);
    }

    let result = produce;

    // Get consumer location from token
    let consumerLat: number | undefined;
    let consumerLng: number | undefined;
    try {
      const auth = await requireAuth(request);
      if (auth.user?.consumer) {
        consumerLat = auth.user.consumer.latitude || undefined;
        consumerLng = auth.user.consumer.longitude || undefined;
      }
    } catch {}

    // Filter by distance
    if (distance && consumerLat && consumerLng) {
      result = produce.filter((p) => {
        if (!p.latitude || !p.longitude) return false;
        const d = calculateDistance(consumerLat!, consumerLng!, p.latitude, p.longitude);
        return d <= distance;
      });
    }

    // Add distance and apply ranking
    const withDistance = result.map((p) => ({
      ...p,
      distance: consumerLat && consumerLng && p.latitude && p.longitude
        ? calculateDistance(consumerLat, consumerLng, p.latitude, p.longitude)
        : undefined,
    }));

    let finalResult;
    if (sortBy === "rank") {
      finalResult = rankProduceList(withDistance as any);
    } else if (sortBy === "price_low") {
      finalResult = withDistance.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      finalResult = withDistance.sort((a, b) => b.price - a.price);
    } else if (sortBy === "distance") {
      finalResult = withDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else {
      finalResult = withDistance.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return successResponse(finalResult);
  } catch (error: any) {
    console.error("Fetch produce error:", error);
    return errorResponse("Failed to fetch produce: " + error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, quantity, unit, price, harvestDate, organic } = body;

    if (!name || !category || !quantity || !price) {
      return errorResponse("Missing required fields");
    }

    const parsed = produceSchema.safeParse({
      ...body,
      quantity: Number(quantity),
      price: Number(price),
      organic: Boolean(organic),
    });
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Invalid produce data");
    }

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "FARMER") {
      return errorResponse("Only farmers can list produce", 403);
    }

    const farmer = auth.user.farmer;
    if (!farmer) return errorResponse("Farmer profile not found", 404);

    const produce = await prisma.produce.create({
      data: {
        farmerId: farmer.id,
        name,
        category,
        description: description || null,
        quantity: parseFloat(quantity),
        unit: unit || "kg",
        price: parseFloat(price),
        harvestDate: new Date(harvestDate || new Date()),
        organic: organic || false,
        status: "ACTIVE",
        latitude: farmer.latitude,
        longitude: farmer.longitude,
      },
    });

    return successResponse(produce, 201);
  } catch (error: any) {
    console.error("Create produce error:", error);
    return errorResponse("Failed to create produce: " + error.message, 500);
  }
}
