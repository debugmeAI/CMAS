# 🚨 CMAS /siː.mæs/

**CMAS (Component Mismatch Alert System)** is a real-time monitoring and alert platform for production line component verification. Built with **ESP32** microcontrollers, it communicates via **MQTT** protocol and features a robust backend with **Node.js**.

> **CMAS** - Ensuring production accuracy through intelligent component verification.  
> A smart, scalable solution for detecting and alerting component mismatches in real-time.

---

## ⚙️ Prerequisites

- **Node.js (v18+)**
- **MQTT Broker** (EMQX, Mosquitto, or HiveMQ)

---

## 📦 Tech Stack

### 🔌 IoT & Communication

- **ESP32** microcontrollers
- **MQTT protocol** via broker (EMQX/Mosquitto)
- **Industrial indicator lights** integration

### 🛠️ Backend

- **Node.js** + **Express.js**
- **MQTT.js** (MQTT client)
- **Real-time event tracking**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/debugmeAI/cmas.git
cd cmas
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

````env
# --- Server ---
PORT=3000                        # API server port

# --- MQTT Broker ---
MQTT_BROKER=mqtt://localhost:1883  # Broker URL (EMQX, Mosquitto, HiveMQ)
MQTT_TOPIC=cmas/indicator          # Topic for component status
MQTT_QOS=1                         # QoS level: 0, 1, or 2

---

### 4. Run the Application

#### Start Backend

```bash
cd backend
npm start
# or for development:
npm run dev
````

---

## ✨ Features

- 🚨 **Real-time component mismatch detection**
- 💡 **Visual indicator control** (Active/Inactive status)
- 🔔 **Instant alert notifications**
- 📈 **Statistics tracking** (success rate, failed alerts)
- 🔌 **MQTT-based device communication**
- 📱 **Scalable for multiple production lines**
- ⚡ **Low latency response** (< 500ms)

---

## 🎯 How It Works

### 1. Component Detection

The ESP32 only subscribes to the MQTT broker when the handy terminal sends a request indicating a component mismatch.

Workflow:

- Handy terminal → sends a POST request to the API /callMiss with line and status.
- Server → validates the line and status.
- If valid → server publishes the update to the MQTT broker.
- Subscribed ESP32 → receives the update and takes action.

### 2. MQTT Communication

When a mismatch is detected, ESP32 publishes alert data to the MQTT broker:

```json
{
	"line": "A1",
	"status": "active"
}
```

### 3. Backend Processing

Node.js backend subscribes to MQTT topics, processes alerts, and:

- Updates indicator status
- Triggers notifications
- Updates statistics

---

## 📡 API Endpoints

### **POST /api/callMiss**

Send component mismatch alert

```bash
curl -X POST http://localhost:3000/api/callMiss \
  -H "Content-Type: application/json" \
  -d '{"line":"A1","status":"active"}'
```

**Response:**

```json
{
	"success": true,
	"message": "Data published successfully",
	"data": {
		"line": "A1",
		"status": "active"
	}
}
```

### **GET /api/device/health**

Check MQTT connection status

```bash
curl http://localhost:3000/api/device/health
```

**Response:**

```json
{
	"service": "cmas-status-api",
	"mqtt": {
		"connected": true,
		"status": "healthy"
	},
	"timestamp": "2025-11-21T19:30:45.123Z"
}
```

### **GET /api/device/status**

Get detailed system status with statistics

```bash
curl http://localhost:3000/api/device/status
```

**Response:**

```json
{
	"timestamp": "2025-11-21T19:30:45.123Z",
	"service": "cmas-status-api",
	"uptime": "2h 15m 30s",
	"mqtt": {
		"connected": true,
		"broker": "mqtt://localhost:1883",
		"topic": "cmas/indicator"
	},
	"statistics": {
		"total": 150,
		"successful": 148,
		"failed": 2,
		"successRate": "98.67%",
		"lastPublish": "2025-11-21T19:30:45.123Z"
	}
}
```

### **GET /api/device/:device_id**

Get device configuration and available lines

```bash
curl http://localhost:3000/api/device/CMAS001
```

**Response:**

```json
{
	"success": true,
	"device_id": "CMAS001",
	"lines": ["A1", "A2"]
}
```

---

## 🗂 Project Structure

```
cmas/
├── backend/             # API server, MQTT client, business logic
│   ├── app.js           # Main server entry point
│   ├── routes/
│   │   ├── index.js     # Route aggregator
│   │   ├── callMiss.js  # Alert endpoint
│   │   └── device.js    # Device & monitoring endpoints
│   ├── mqtt/
│   │   ├── config.js    # MQTT connection config
│   │   └── publisher.js # MQTT publishing logic
│   └── .env             # Environment variables
└── README.md
```

---

## 🔧 Device Configuration

Edit `deviceConfig` in `routes/device.js` to add more devices:

```javascript
const deviceConfig = {
	CMAS001: ["A1", "A2"],
	CMAS002: ["B1", "B2"],
	CMAS003: ["C1", "C2", "C3"],
	// Add more devices...
};
```

---

## 🧪 Testing

### Test MQTT Publishing

```bash
# Using curl
curl -X POST http://localhost:3000/api/callMiss \
  -H "Content-Type: application/json" \
  -d '{"line":"A1","status":"active"}'

# Using Postman
POST http://localhost:3000/api/callMiss
Body (JSON):
{
  "line": "A1",
  "status": "active"
}
```

### Monitor MQTT Messages

```bash
# Subscribe to MQTT topic (using mosquitto_sub)
mosquitto_sub -h localhost -t "cmas/indicator" -v
```

---

## 📊 Statistics & Monitoring

CMAS tracks the following metrics:

- **Total Requests**: Number of alert requests received
- **Successful Publish**: Successfully published to MQTT
- **Failed Publish**: Failed MQTT publish attempts
- **Success Rate**: Percentage of successful publishes
- **Last Publish Time**: Timestamp of last alert (GMT+7)
- **System Uptime**: How long the system has been running

---

## 🌐 Timezone

All timestamps use **GMT+7 (WIB - Waktu Indonesia Barat)**:

```javascript
// Example timestamp format:
"2025-11-21T19:30:45.123Z"; // 19:30:45 WIB
```

---

## 📃 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute as needed.

---

## 📬 Contact

For questions or support, please open an issue or contact the development team.

---

**Built with ❤️ for production line quality assurance**
