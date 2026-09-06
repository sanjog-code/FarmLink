import { calculateDistance } from "./utils";

interface RankedProduce {
  id: string;
  name: string;
  category: string;
  price: number;
  grade: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function calculateRankScore(
  produce: RankedProduce,
  consumerLat?: number,
  consumerLng?: number
): number {
  const gradeScore = calculateGradeScore(produce.grade);
  const distanceScore = calculateDistanceScore(
    produce.latitude,
    produce.longitude,
    consumerLat,
    consumerLng
  );
  const priceScore = calculatePriceScore(produce.price, produce.category);

  return gradeScore * 0.4 + distanceScore * 0.4 + priceScore * 0.2;
}

function calculateGradeScore(grade: string | null): number {
  const scores: Record<string, number> = {
    A_PLUS: 100,
    A: 80,
    B: 60,
    C: 40,
  };
  return scores[grade || "B"] || 50;
}

function calculateDistanceScore(
  lat: number | null,
  lng: number | null,
  consumerLat?: number,
  consumerLng?: number
): number {
  if (!lat || !lng || !consumerLat || !consumerLng) return 50;

  const distance = calculateDistance(consumerLat, consumerLng, lat, lng);

  if (distance <= 5) return 100;
  if (distance <= 10) return 85;
  if (distance <= 25) return 70;
  if (distance <= 50) return 50;
  if (distance <= 100) return 30;
  return 10;
}

function calculatePriceScore(price: number, category: string): number {
  const avgPrices: Record<string, number> = {
    Fruits: 60,
    Vegetables: 40,
    Grains: 30,
    Pulses: 80,
    Dairy: 50,
    Others: 45,
  };

  const avg = avgPrices[category] || 45;
  const ratio = price / avg;

  if (ratio <= 0.7) return 100;
  if (ratio <= 0.9) return 85;
  if (ratio <= 1.1) return 70;
  if (ratio <= 1.3) return 50;
  return 30;
}

export function rankProduceList<T extends RankedProduce>(
  produceList: T[],
  consumerLat?: number,
  consumerLng?: number
): (T & { rankScore: number })[] {
  return produceList
    .map((p) => ({
      ...p,
      rankScore: calculateRankScore(p, consumerLat, consumerLng),
    }))
    .sort((a, b) => b.rankScore - a.rankScore);
}
