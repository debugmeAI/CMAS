require("dotenv").config();
const mqtt = require("mqtt");

const brokerURL = process.env.MQTT_BROKER;
const topic = process.env.MQTT_TOPIC;
const qos = parseInt(process.env.MQTT_QOS || "0");

const client = mqtt.connect(brokerURL, {
	clientId: "CMAS_" + Date.now().toString(16).toUpperCase(),
	clean: true,
	reconnectPeriod: 1000,
	connectTimeout: 30000,
	keepalive: 60,
});

let isConnected = false;

client.on("connect", () => {
	isConnected = true;
	console.log("MQTT connected on", brokerURL);
});

client.on("reconnect", () => {
	console.log("MQTT reconnecting...");
});

client.on("error", (err) => {
	isConnected = false;
	console.error("MQTT error", err);
});

client.on("offline", () => {
	isConnected = false;
	console.warn("MQTT client offline");
});

client.on("close", () => {
	isConnected = false;
	console.log("MQTT connection closed");
});

process.on("SIGINT", () => {
	console.log("\nClosing MQTT connection...");
	client.end(false, () => {
		console.log("MQTT connection closed gracefully");
		process.exit(0);
	});
});

module.exports = {
	client,
	topic,
	qos,
	brokerURL,
	getConnectionStatus: () => isConnected,
};
