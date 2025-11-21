const express = require("express");
const router = express.Router();
const { getConnectionStatus, brokerURL, topic } = require("../mqtt/config");

const stats = {
	successfulPublish: 0,
	failedPublish: 0,
	lastPublishTime: null,
	startTime: new Date(),
};

const deviceConfig = {
	CMAS001: ["A1", "A2"],
	CMAS002: ["B1", "B2"],
};

router.get("/health", (req, res) => {
	const mqttConnected = getConnectionStatus();

	res.status(mqttConnected ? 200 : 503).json({
		service: "cmas-status-api",
		mqtt: {
			connected: mqttConnected,
			status: mqttConnected ? "healthy" : "unhealthy",
		},
		timestamp: new Date().toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }),
	});
});

router.get("/status", (req, res) => {
	const mqttConnected = getConnectionStatus();
	const uptime = Math.floor((Date.now() - stats.startTime) / 1000);

	res.json({
		timestamp: new Date().toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }),
		service: "cmas-status-api",
		uptime: formatUptime(uptime),
		mqtt: {
			connected: mqttConnected,
			broker: brokerURL,
			topic: topic,
		},
		statistics: {
			total: stats.successfulPublish + stats.failedPublish,
			successful: stats.successfulPublish,
			failed: stats.failedPublish,
			successRate: calculateSuccessRate(),
			lastPublish: stats.lastPublishTime,
		},
	});
});

router.get("/:device_id", (req, res) => {
	const { device_id } = req.params;
	const lines = deviceConfig[device_id];

	if (!lines) {
		return res.status(404).json({
			success: false,
			message: "Device not found",
			available_devices: Object.keys(deviceConfig),
		});
	}

	res.json({
		success: true,
		device_id,
		lines,
	});
});

function formatUptime(seconds) {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	const parts = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	parts.push(`${secs}s`);

	return parts.join(" ");
}

function calculateSuccessRate() {
	const total = stats.successfulPublish + stats.failedPublish;
	if (total === 0) return "N/A";
	return `${((stats.successfulPublish / total) * 100).toFixed(2)}%`;
}

module.exports = { router, stats, deviceConfig };
