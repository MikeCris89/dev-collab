import prisma from "./db/client.js";

async function testConnection() {
	try {
		// Test connection
		await prisma.$connect();
		console.log("✅ Database connected successfully!");

		// Test a simple query (should return empty array for now)
		const users = await prisma.user.findMany();
		console.log("Users count:", users.length);
	} catch (error) {
		console.error("❌ Database connection failed:", error);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
