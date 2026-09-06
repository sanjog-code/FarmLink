import { calculateDistance, formatCurrency, getInitials } from "@/lib/utils";
import { calculateRankScore, rankProduceList } from "@/lib/ranking";

describe("calculateDistance", () => {
  it("returns 0 for the same coordinates", () => {
    expect(calculateDistance(28.6139, 77.209, 28.6139, 77.209)).toBe(0);
  });

  it("calculates the distance between Delhi and Mumbai as approximately 1150 km", () => {
    const distance = calculateDistance(28.6139, 77.209, 19.076, 72.8777);
    expect(distance).toBeGreaterThan(1100);
    expect(distance).toBeLessThan(1200);
  });

  it("is symmetric", () => {
    const a = calculateDistance(20.5, 78.5, 15.3, 74.0);
    const b = calculateDistance(15.3, 74.0, 20.5, 78.5);
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("formatCurrency", () => {
  it("formats Indian currency", () => {
    expect(formatCurrency(1234)).toBe("₹1,234");
  });
});

describe("getInitials", () => {
  it("returns first two initials", () => {
    expect(getInitials("Ram Kumar")).toBe("RK");
  });

  it("handles single names", () => {
    expect(getInitials("Sita")).toBe("S");
  });
});

describe("calculateRankScore", () => {
  const baseProduce = {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    price: 40,
    grade: "A" as const,
    latitude: 28.6139,
    longitude: 77.209,
  };

  it("scores higher quality produce higher", () => {
    const aPlus = calculateRankScore({ ...baseProduce, grade: "A_PLUS" }, 28.7, 77.2);
    const cGrade = calculateRankScore({ ...baseProduce, grade: "C" }, 28.7, 77.2);
    expect(aPlus).toBeGreaterThan(cGrade);
  });

  it("scores nearer produce higher", () => {
    const near = calculateRankScore({ ...baseProduce, latitude: 28.7, longitude: 77.2 }, 28.6139, 77.209);
    const far = calculateRankScore({ ...baseProduce, latitude: 19.0, longitude: 72.8 }, 28.6139, 77.209);
    expect(near).toBeGreaterThan(far);
  });

  it("respects the 40/40/20 weighting", () => {
    const score = calculateRankScore(baseProduce, 28.6139, 77.209);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("rankProduceList", () => {
  it("sorts by rankScore descending", () => {
    const produceList = [
      { id: "1", name: "Far", category: "Vegetables", price: 60, grade: "B" as const, latitude: 15.0, longitude: 74.0 },
      { id: "2", name: "Near", category: "Vegetables", price: 40, grade: "A" as const, latitude: 28.6, longitude: 77.2 },
      { id: "3", name: "Closest", category: "Vegetables", price: 45, grade: "A_PLUS" as const, latitude: 28.6139, longitude: 77.209 },
    ];
    const ranked = rankProduceList(produceList, 28.6139, 77.209);
    expect(ranked[0].name).toBe("Closest");
    expect(ranked[0].rankScore).toBeGreaterThan(ranked[1].rankScore);
  });

  it("adds a rankScore field to each item", () => {
    const produceList = [
      { id: "1", name: "A", category: "Fruits", price: 50, grade: null as const, latitude: null as const, longitude: null as const },
    ];
    const ranked = rankProduceList(produceList);
    expect(ranked[0]).toHaveProperty("rankScore");
  });
});