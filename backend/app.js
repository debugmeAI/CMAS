require("dotenv").config();
require("./mqtt/config");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use("/api", routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`CMAS API server running on http://localhost:${PORT}/api`);
});
