let express = require("express");
let router = express.Router();
const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres", "postgres", "hi", {
  host: "localhost",
  dialect: "postgres",
});

(async () => {
  await sequelize.authenticate();
})();
let Students = sequelize.define("students", {
  name: { type: Sequelize.STRING },
  roll: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
});
let Attendance = sequelize.define("attendance", {
  date: { type: Sequelize.DATE },
  month: { type: Sequelize.INTEGER },
  roll: { type: Sequelize.INTEGER },
});

// Validation is required, can use Joi
router.get("/api/v1/attendance/:roll", async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { roll: req.params.roll },
      raw: true,
      order: [["date", "DESC"]],
      limit: 5,
    });
    return res.status(200).json({ attendance });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
router.get("/api/v1/attendance/month/:month", async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { month: req.params.month },
      raw: true,
      order: [["date", "DESC"]],
    });
    return res.json({ attendance });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
router.get("/api/v1/attendance/threshold/", async (req, res) => {
  try {
    let days = new Date(2022, req.params.month, 0).getDate();
    let { count } = await Attendance.findAndCountAll({
      where: { month: req.params.month, roll: req.params },
      raw: true,
      order: [["date", "DESC"]],
    });
    return res.json({ threshold: (count / days) * 100 < 85 });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
module.exports = router;
