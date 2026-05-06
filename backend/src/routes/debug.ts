import { Router } from "express";

const router = Router();

router.post("/debug-log", (req, res) => {
	const { message, url, userAgent, isStandalone, timestamp } = req.body;
	console.error("[CLIENT ERROR]", {
		message,
		url,
		userAgent,
		isStandalone,
		timestamp,
	});
	res.sendStatus(204);
});

export default router;
