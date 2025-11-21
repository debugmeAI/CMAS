const { client, topic, qos } = require("./config");

function publishIndicator(data) {
	const message = JSON.stringify(data);

	client.publish(topic, message, { qos }, (err) => {
		if (err) {
			console.error("MQTT publish failed:", err);
		} else {
			console.log(`Published ${topic}:`, message);
		}
	});
}

module.exports = { publishIndicator };
