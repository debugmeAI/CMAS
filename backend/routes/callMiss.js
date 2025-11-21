const express = require("express");
const router = express.Router();
const { publishIndicator } = require("../mqtt/publisher");
const { getConnectionStatus } = require("../mqtt/config");
const { stats, deviceConfig } = require("./device");

router.post("/", async (req, res) => {
	const { line, status } = req.body;

	if (!line || line.trim() === "") {
		return res.status(400).json({
			success: false,
			error: "Line name cannot be empty",
		});
	}

	const validStatuses = ["active", "inactive"];
	if (!status || !validStatuses.includes(status.toLowerCase())) {
		return res.status(400).json({
			success: false,
			error: "Wrong status",
		});
	}

	const allLines = Object.values(deviceConfig).flat();
	if (!allLines.includes(line.trim())) {
		return res.status(400).json({
			success: false,
			error: "Line not registered in any device",
			available_lines: allLines,
		});
	}

	if (!getConnectionStatus()) {
		stats.failedPublish++;
		return res.status(503).json({
			success: false,
			error: "MQTT service unavailable",
		});
	}

	const payload = {
		line: line.trim(),
		status: status.toLowerCase(),
	};

	try {
		await publishIndicator(payload);

		stats.successfulPublish++;
		stats.lastPublishTime = new Date().toLocaleString("en-GB", {
			timeZone: "Asia/Jakarta",
		});

		res.status(201).json({
			success: true,
			message: "Data published successfully",
			data: payload,
		});
	} catch (error) {
		console.error("Failed to publish:", error);
		stats.failedPublish++;

		res.status(500).json({
			success: false,
			error: "Failed to publish to MQTT",
			message: error.message,
		});
	}
});

module.exports = router;
