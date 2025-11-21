const express = require("express");
const router = express.Router();

const callMissRouter = require("./callMiss");
const { router: deviceRouter } = require("./device");

router.use("/callMiss", callMissRouter);
router.use("/device", deviceRouter);

module.exports = router;
