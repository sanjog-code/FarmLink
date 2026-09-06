import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET() {
  try {
    const listings = await prisma.bulkListing.findMany({
      where: { active: true },
      include: {
        farmer: { include: { user: { select: { name: true, avatar: true } } } },
        produce: {
          include: {
            images: true,
            farmer: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(listings);
  } catch (error: any) {
    return errorResponse("Failed to fetch bulk listings: " + error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { produceId, moq, bulkPrice, availableQty, description } = body;

    if (!produceId || !moq || !bulkPrice) {
      return errorResponse("Missing required fields");
    }

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "FARMER") {
      return errorResponse("Only farmers can create bulk listings", 403);
    }

    const farmer = auth.user.farmer;
    if (!farmer) return errorResponse("Farmer profile not found");

    const produce = await prisma.produce.findUnique({ where: { id: produceId } });
    if (!produce) return errorResponse("Produce not found", 404);
    if (produce.farmerId !== farmer.id) {
      return errorResponse("Not your produce", 403);
    }

    const listing = await prisma.bulkListing.create({
      data: {
        farmerId: farmer.id,
        produceId,
        moq: parseFloat(moq),
        bulkPrice: parseFloat(bulkPrice),
        availableQty: availableQty ? parseFloat(availableQty) : produce.quantity,
        description: description || null,
      },
    });

    return successResponse(listing, 201);
  } catch (error: any) {
    return errorResponse("Failed to create bulk listing: " + error.message, 500);
  }
}
