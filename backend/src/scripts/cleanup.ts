// backend/src/scripts/cleanup.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const staleWhere = { isProtected: false, createdAt: { lt: sevenDaysAgo } };
	const demoFilter = { users: { some: { username: { startsWith: "demouser" } } } };

	console.log(`[cleanup] Starting at ${new Date().toISOString()}`);
	console.log(
		`[cleanup] Deleting unprotected teams created before ${sevenDaysAgo.toISOString()}`,
	);

	// Count demo accounts among the stale teams before deleting (deleteMany
	// doesn't return the rows it removed).
	const deletedDemoTeams = await prisma.team.count({
		where: { ...staleWhere, ...demoFilter },
	});

	const result = await prisma.team.deleteMany({ where: staleWhere });

	// Snapshot of current usage after cleanup.
	const totalTeams = await prisma.team.count();
	const totalDemoTeams = await prisma.team.count({ where: demoFilter });

	await prisma.heartbeat.create({
		data: {
			deletedTeams: result.count,
			deletedDemoTeams,
			totalTeams,
			totalDemoTeams,
		},
	});

	console.log(
		`[cleanup] Deleted ${result.count} team(s) (${deletedDemoTeams} demo)`,
	);
	console.log(
		`[cleanup] Now ${totalTeams} team(s), ${totalDemoTeams} demo`,
	);
}

cleanup()
	.catch((err) => {
		console.error("[cleanup] Failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
