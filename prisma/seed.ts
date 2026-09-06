import { PrismaClient, Prisma, UserRole, ProduceStatus, ProduceGrade, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const indianNames = [
  "Arun Sharma", "Priya Patel", "Rahul Verma", "Sunita Devi", "Vijay Kumar",
  "Amit Singh", "Kavita Reddy", "Rajesh Gupta", "Meena Joshi", "Suresh Nair",
  "Anjali Mehta", "Deepak Yadav", "Rekha Das", "Mohan Iyer", "Pooja Agarwal",
  "Sanjay Bhat", "Lakshmi Menon", "Kiran Rao", "Nisha Kapoor", "Anil Kulkarni",
  "Geeta Mishra", "Rajiv Saxena", "Sneha Pillai", "Varun Krishnan", "Asha Devi",
  "Ramesh Patel", "Divya Sharma", "Nitin Kumar", "Preeti Singh", "Ashok Gupta",
  "Manisha Joshi", "Peter D'Souza", "Savita Rao", "Harish Hegde", "Anita Desai",
  "Ganesh Prasad", "Ritu Verma", "Sachin Bansal", "Neha Dubey", "Karan Malhotra",
  "Shalini Tripathi", "Prakash Raj", "Meera Nair", "Vikram Choudhary", "Jyoti Sinha",
  "Arvind Shelke", "Ranjana Pawar", "Dinesh Thorat", "Vandana Shinde", "Mahesh Kadam",
  "Seema Bhagat", "Neeraj Tiwari", "Anju Chaudhary", "Brijesh Pandey", "Shivani Saxena",
  "Rohit Chawla", "Komal Arora", "Gaurav Bhardwaj", "Ishita Roy", "Manish Jain",
  "Tanvi Kulkarni", "Aditya Rao", "Pallavi Patil", "Kunal Shah", "Swati Kulkarni",
  "Naveen Reddy", "Hema Chandra", "Vishal Kumar", "Rashmi Anand", "Siddharth Menon",
  "Deepika Rana", "Nilesh Gupta", "Shreya Iyer", "Akash Sharma", "Pragya Mishra",
  "Sandeep Yadav", "Nidhi Verma", "Rakesh Tiwari", "Aarti Singh", "Naren Patel",
  "Krishna Murthy", "Bhavna Shah", "Suresh Babu", "Lalita Devi", "Manoj Kumar",
  "Rituraj Bir", "Sarita Kumari", "Devendra Singh", "Poonam Joshi", "Balwant Singh",
  "Kamla Devi", "Narayan Rao", "Usha Rani", "Gopal Krishna", "Maya Devi",
  "Chandra Shekhar", "Sunil Dutt", "Anita Sharma", "Raj Kumar", "Sita Devi",
];

const states = [
  "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Uttar Pradesh",
  "Punjab", "Haryana", "Gujarat", "Madhya Pradesh", "Rajasthan",
  "Bihar", "West Bengal", "Odisha", "Telangana", "Kerala",
];

const districts: Record<string, string[]> = {
  Maharashtra: ["Pune", "Nashik", "Nagpur", "Satara", "Kolhapur", "Aurangabad", "Ahmednagar", "Solapur"],
  Karnataka: ["Bangalore Rural", "Mysore", "Hubli", "Belgaum", "Tumkur", "Shimoga", "Dharwad", "Hassan"],
  "Tamil Nadu": ["Coimbatore", "Madurai", "Trichy", "Salem", "Vellore", "Thanjavur", "Erode", "Tirunelveli"],
  "Andhra Pradesh": ["Guntur", "Krishna", "Chittoor", "Kurnool", "Nellore", "Anantapur", "Prakasam", "Kadapa"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Meerut", "Allahabad", "Bareilly", "Gorakhpur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Ferozepur", "Sangrur", "Patiala"],
  Haryana: ["Karnal", "Hisar", "Rohtak", "Panipat", "Ambala", "Gurgaon", "Sonipat", "Kurukshetra"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Junagadh", "Anand", "Mehsana", "Bharuch"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Chhindwara"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Sikar"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Begusarai", "Chhapra"],
  "West Bengal": ["Kolkata", "Howrah", "Bardhaman", "Nadia", "Murshidabad", "Hooghly", "Birbhum", "Midnapore"],
  Odisha: ["Bhubaneswar", "Cuttack", "Khordha", "Balasore", "Bargarh", "Sambalpur", "Puri", "Rourkela"],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Medak", "Nalgonda", "Mahabubnagar"],
  Kerala: ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Palakkad", "Kollam", "Kottayam", "Alappuzha"],
};

const villages = [
  "Ganeshpur", "Ramnagar", "Krishnapuram", "Shivaji Nagar", "Bharatpur",
  "Sundarpur", "Vishwakarma", "Laxmipur", "Hanumanthpur", "Basavanagudi",
  "Chandrapur", "Gopalpur", "Mahadevpur", "Bhagwatpur", "Anandpur",
  "Vaishnavpur", "Keshavpur", "Vittal Nagar", "Narayanpur", "Mallikarjuna",
  "Venkatapuram", "Srinivasapur", "Padmanabhpur", "Raghunathpur", "Devipuram",
];

const farmerFirstNames = [
  "Ram", "Shyam", "Hari", "Gopal", "Krishna", "Mohan", "Sohan", "Dinesh",
  "Ramesh", "Suresh", "Mahesh", "Ganesh", "Bharat", "Jagdish", "Narayan",
  "Shankar", "Prakash", "Vijay", "Ajay", "Sanjay", "Harsh", "Kailash",
  "Devendra", "Balram", "Sunder", "Roshan", "Lokesh", "Pawan", "Ranjit", "Jitendra",
];

const farmerLastNames = [
  "Gawande", "Patil", "Deshmukh", "More", "Jadhav", "Pawar", "Kadam", "Thorat",
  "Mahale", "Lokhande", "Gade", "Bhosale", "Shinde", "Sawant", "Chavan",
  "Kale", "Khade", "Bansode", "Waghmare", "Ghule", "Deore", "Ahire",
  "Suryawanshi", "Nikam", "Pardeshi", "Khandekar", "Sapkal", "Jagtap", "Surve", "Gavade",
];

const consumerFirstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna",
  "Ishaan", "Shaurya", "Ananya", "Diya", "Ira", "Myra", "Saanvi", "Anika",
  "Navya", "Pari", "Aadhya", "Aarohi", "Aryan", "Kabir", "Laksh", "Ayaan",
];

const consumerLastNames = [
  "Sharma", "Verma", "Gupta", "Singh", "Patel", "Kumar", "Jain", "Mehta",
  "Agarwal", "Malhotra", "Chopra", "Bhatt", "Saxena", "Kapoor", "Khanna",
];

const produceData = [
  { name: "Fresh Tomatoes", category: "Vegetables", basePrice: 30, unit: "kg", emoji: "🍅" },
  { name: "Organic Onions", category: "Vegetables", basePrice: 25, unit: "kg", emoji: "🧅" },
  { name: "Potatoes", category: "Vegetables", basePrice: 25, unit: "kg", emoji: "🥔" },
  { name: "Cabbages", category: "Vegetables", basePrice: 40, unit: "piece", emoji: "🥬" },
  { name: "Cauliflower", category: "Vegetables", basePrice: 45, unit: "piece", emoji: "🥦" },
  { name: "Brinjal (Eggplant)", category: "Vegetables", basePrice: 35, unit: "kg", emoji: "🍆" },
  { name: "Green Chillies", category: "Vegetables", basePrice: 60, unit: "kg", emoji: "🌶️" },
  { name: "Okra (Bhindi)", category: "Vegetables", basePrice: 50, unit: "kg", emoji: "🌱" },
  { name: "Spinach", category: "Vegetables", basePrice: 30, unit: "bunch", emoji: "🥬" },
  { name: "Carrots", category: "Vegetables", basePrice: 40, unit: "kg", emoji: "🥕" },
  { name: "Mangoes (Alphonso)", category: "Fruits", basePrice: 200, unit: "dozen", emoji: "🥭" },
  { name: "Bananas", category: "Fruits", basePrice: 40, unit: "dozen", emoji: "🍌" },
  { name: "Oranges", category: "Fruits", basePrice: 60, unit: "kg", emoji: "🍊" },
  { name: "Grapes", category: "Fruits", basePrice: 120, unit: "kg", emoji: "🍇" },
  { name: "Watermelons", category: "Fruits", basePrice: 25, unit: "piece", emoji: "🍉" },
  { name: "Papayas", category: "Fruits", basePrice: 30, unit: "piece", emoji: "🍈" },
  { name: "Pomegranates", category: "Fruits", basePrice: 150, unit: "kg", emoji: "🍎" },
  { name: "Guavas", category: "Fruits", basePrice: 40, unit: "kg", emoji: "🍐" },
  { name: "Basmati Rice", category: "Grains", basePrice: 80, unit: "kg", emoji: "🍚" },
  { name: "Wheat", category: "Grains", basePrice: 28, unit: "kg", emoji: "🌾" },
  { name: "Maize", category: "Grains", basePrice: 22, unit: "kg", emoji: "🌽" },
  { name: "Millet (Bajra)", category: "Grains", basePrice: 35, unit: "kg", emoji: "🌾" },
  { name: "Tur Dal", category: "Pulses", basePrice: 120, unit: "kg", emoji: "🫘" },
  { name: "Chana Dal", category: "Pulses", basePrice: 90, unit: "kg", emoji: "🫘" },
  { name: "Moong Dal", category: "Pulses", basePrice: 110, unit: "kg", emoji: "🫘" },
  { name: "Urad Dal", category: "Pulses", basePrice: 130, unit: "kg", emoji: "🫘" },
  { name: "Cow Milk", category: "Dairy", basePrice: 55, unit: "L", emoji: "🥛" },
  { name: "Buffalo Milk", category: "Dairy", basePrice: 60, unit: "L", emoji: "🥛" },
  { name: "Curd (Yogurt)", category: "Dairy", basePrice: 70, unit: "L", emoji: "🥛" },
  { name: "Ghee", category: "Dairy", basePrice: 600, unit: "kg", emoji: "🧈" },
  { name: "Honey", category: "Others", basePrice: 500, unit: "kg", emoji: "🍯" },
  { name: "Ginger", category: "Others", basePrice: 80, unit: "kg", emoji: "🫚" },
  { name: "Turmeric", category: "Others", basePrice: 200, unit: "kg", emoji: "🌿" },
  { name: "Coriander", category: "Others", basePrice: 60, unit: "bunch", emoji: "🌿" },
];async function main() {
  console.log("🌱 Starting FarmLink seed...");

  // Clean existing data
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.logistics.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.address.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.bulkOrder.deleteMany(),
    prisma.bulkListing.deleteMany(),
    prisma.produceGradeDetail.deleteMany(),
    prisma.produceImage.deleteMany(),
    prisma.produce.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.consumer.deleteMany(),
    prisma.farmer.deleteMany(),
    prisma.bulkBuyer.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("password123", 12);

  // Create Admin
  await prisma.user.create({
    data: {
      name: "FarmLink Admin",
      email: "admin@farmlink.in",
      password: passwordHash,
      role: "ADMIN",
      admin: { create: {} },
    },
  });
  console.log("✅ Created admin");

  // Create 50 Farmers
  console.log("👨‍🌾 Creating 50 farmers...");
  const farmers = [];
  for (let i = 0; i < 50; i++) {
    const firstName = farmerFirstNames[i % farmerFirstNames.length];
    const lastName = farmerLastNames[i % farmerLastNames.length];
    const name = `${firstName} ${lastName}`;
    const state = states[i % states.length];
    const district = districts[state][i % districts[state].length];
    const village = villages[i % villages.length];
    const farmSize = Math.round((1 + Math.random() * 19) * 10) / 10;
    const mobile = `9${String(100000000 + i)}`;
    const farmerId = `FMR-2026-${String(10001 + i)}`;

    const farmer = await prisma.user.create({
      data: {
        name,
        password: passwordHash,
        mobile,
        role: "FARMER",
        farmer: {
          create: {
            farmerId,
            state,
            district,
            village,
            farmSize,
            verified: i % 3 !== 0,
            latitude: 8 + Math.random() * 29,
            longitude: 72 + Math.random() * 25,
          },
        },
      },
      include: { farmer: true },
    });
    farmers.push(farmer.farmer!);
  }
  console.log("✅ Created 50 farmers");

  // Create 20 Bulk Buyers
  console.log("🏭 Creating 20 bulk buyers...");
  const bulkBuyers = [];
  const firmSuffixes = ["Traders", "Enterprises", "Agri Foods", "Wholesale", "Suppliers", "Distribution", "Retail", "Foods Pvt Ltd", "Exports", "Producers"];
  for (let i = 0; i < 20; i++) {
    const firmName = `${consumerFirstNames[i % consumerFirstNames.length]} ${consumerLastNames[i % consumerLastNames.length]} ${firmSuffixes[i % firmSuffixes.length]}`;
    const mobile = `9${String(300000000 + i)}`;
    const email = `buyer${i + 1}@gmail.com`;
    const gstNumber = `2${String(i).padStart(1, "0")}ABCDE${String(1234 + i)}${String.fromCharCode(65 + i % 26)}${i % 2 === 0 ? "1" : "5"}Z${i % 4 === 0 ? "5" : "7"}`;

    const buyer = await prisma.user.create({
      data: {
        name: firmName,
        email,
        mobile,
        password: passwordHash,
        role: "BULK_BUYER",
        bulkBuyer: {
          create: {
            firmName,
            gstNumber,
            businessAddress: `${Math.floor(100 + Math.random() * 900)}, Market Road, ${districts[states[i % states.length]][0]}, ${states[i % states.length]}`,
            verified: i % 2 === 0,
          },
        },
      },
      include: { bulkBuyer: true },
    });
    bulkBuyers.push(buyer.bulkBuyer!);
  }
  console.log("✅ Created 20 bulk buyers");
  // Create 100 Consumers
  console.log("🛒 Creating 100 consumers...");
  const consumers = [];
  for (let i = 0; i < 100; i++) {
    const firstName = consumerFirstNames[i % consumerFirstNames.length];
    const lastName = consumerLastNames[i % consumerLastNames.length];
    const name = `${firstName} ${lastName}`;
    const mobile = `9${String(200000000 + i)}`;
    const email = `user${i + 1}@gmail.com`;
    const state = states[i % states.length];
    const district = districts[state][i % districts[state].length];

    const consumer = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: passwordHash,
        role: "CONSUMER",
        consumer: {
          create: {
            address: `${Math.floor(100 + Math.random() * 900)}, ${villages[i % villages.length]} Colony, ${district}, ${state}`,
            latitude: 8 + Math.random() * 29,
            longitude: 72 + Math.random() * 25,
            addresses: {
              create: {
                label: "Home",
                address: `${Math.floor(100 + Math.random() * 900)}, ${villages[i % villages.length]} Colony, ${district}, ${state}`,
                city: district,
                state,
                pincode: String(Math.floor(100000 + Math.random() * 900000)),
                latitude: 8 + Math.random() * 29,
                longitude: 72 + Math.random() * 25,
                isDefault: true,
              },
            },
          },
        },
      },
      include: { consumer: true },
    });
    consumers.push(consumer.consumer!);
  }
  console.log("✅ Created 100 consumers");

  // Create 100 Produce Listings
  console.log("🌾 Creating 100 produce listings...");
  const produceRecords = [];
  for (let i = 0; i < 100; i++) {
    const farmer = farmers[i % farmers.length];
    const produceDatum = produceData[i % produceData.length];
    const grade = (["A_PLUS", "A", "A", "B", "C"] as ProduceGrade[])[i % 5];
    const status = (["ACTIVE", "ACTIVE", "ACTIVE", "DRAFT", "SOLD"] as ProduceStatus[])[i % 5];
    const organic = i % 3 === 0;
    const price = Math.round((produceDatum.basePrice + (organic ? produceDatum.basePrice * 0.2 : 0) + Math.random() * 10) * 10) / 10;
    const quantity = Math.round(50 + Math.random() * 450);
    let gradeQuality = { A_PLUS: 95, A: 85, B: 70, C: 55 }[grade] || 85;

    const produce = await prisma.produce.create({
      data: {
        farmerId: farmer.id,
        name: `${produceDatum.name}`,
        category: produceDatum.category,
        description: `Fresh ${produceDatum.name.toLowerCase()} harvested from ${farmer.village}, ${farmer.district}. Grade ${grade} quality produce.`,
        quantity,
        unit: produceDatum.unit,
        price,
        harvestDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000),
        organic,
        status,
        grade,
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-1610348725531843dff563e2c?w=400`,
              isPrimary: true,
            },
          ],
        },
        gradeDetail: status === "ACTIVE" ? {
          create: {
            grade,
            qualityScore: gradeQuality + Math.floor(Math.random() * 5),
            colorUniformity: gradeQuality - 5 + Math.floor(Math.random() * 10),
            surfaceDefects: 100 - gradeQuality + Math.floor(Math.random() * 10),
            freshnessScore: gradeQuality - 10 + Math.floor(Math.random() * 10),
          },
        } : undefined,
      },
    });
    produceRecords.push(produce);
  }
  console.log("✅ Created 100 produce listings");

  // Create Bulk Listings
  console.log("📦 Creating bulk listings...");
  for (let i = 0; i < 30; i++) {
    const produce = produceRecords.filter((p) => p.status === "ACTIVE")[i % 30];
    if (!produce) continue;
    await prisma.bulkListing.create({
      data: {
        farmerId: produce.farmerId,
        produceId: produce.id,
        moq: 50 + (i % 5) * 50,
        bulkPrice: Math.round(produce.price * 0.8 * 10) / 10,
        availableQty: produce.quantity,
        description: `Bulk supply of ${produce.name} at wholesale rates`,
      },
    });
  }
  console.log("✅ Created bulk listings");

  // Create some orders
  console.log("📋 Creating sample orders...");
  const activeProduce = produceRecords.filter((p) => p.status === "ACTIVE");
  for (let i = 0; i < 20; i++) {
    const consumer = consumers[i % consumers.length];
    const produce = activeProduce[i % activeProduce.length];
    if (!produce) continue;
    const farmer = farmers.find((f) => f.id === produce.farmerId);
    if (!farmer) continue;
    const qty = Math.max(1, Math.floor(Math.random() * 10));
    const totalAmount = qty * produce.price;
    const statuses: OrderStatus[] = ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING", "DELIVERED", "CONFIRMED"];
    const status = statuses[i % statuses.length];

    await prisma.order.create({
      data: {
        orderNumber: `FL-${String(1000 + i)}-${Date.now().toString(36).toUpperCase()}`,
        consumerId: consumer.id,
        farmerId: farmer.id,
        addressId: null,
        status,
        totalAmount,
        deliveryFee: 40,
        paymentStatus: status === "DELIVERED" ? "COMPLETED" : "PENDING",
        items: {
          create: [{
            produceId: produce.id,
            quantity: qty,
            price: produce.price,
          }],
        },
        logistics: {
          create: { status },
        },
        transaction: {
          create: {
            amount: totalAmount + 40,
            method: "upi",
            status: status === "DELIVERED" ? "COMPLETED" : "PENDING",
          },
        },
      },
    });
  }
  console.log("✅ Created sample orders");

  // Create sample reviews
  console.log("⭐ Creating sample reviews...");
  for (let i = 0; i < 15; i++) {
    const consumer = consumers[i % consumers.length];
    const produce = activeProduce[i % activeProduce.length];
    if (!produce) continue;
    await prisma.review.create({
      data: {
        userId: consumer.userId,
        produceId: produce.id,
        rating: 3 + (i % 3),
        comment: `${["Fresh", "Good quality", "Excellent", "Average", "Very fresh"][i % 5]} produce, fast delivery!`,
      },
    }).catch(() => {});
  }
  console.log("✅ Created reviews");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });