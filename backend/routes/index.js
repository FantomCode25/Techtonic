const express = require("express");
const userRouter = require("./user");
const router = express.Router();
const fareRouter = require("./fareRoutes");
const cors = require("cors");
router.use(cors());

router.use("/user", userRouter)
router.use("/cost", fareRouter)


module.exports = router