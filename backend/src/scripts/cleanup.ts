// backend/src/scripts/cleanup.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	console.log(`[cleanup] Starting at ${new Date().toISOString()}`);
	console.log(
		`[cleanup] Deleting unprotected teams created before ${sevenDaysAgo.toISOString()}`,
	);

	const result = await prisma.team.deleteMany({
		where: {
			isProtected: false,
			createdAt: { lt: sevenDaysAgo },
		},
	});

	console.log(`[cleanup] Deleted ${result.count} team(s)`);
}

cleanup()
	.catch((err) => {
		console.error("[cleanup] Failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
