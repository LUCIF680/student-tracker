const faker = require("@faker-js/faker").faker;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres", "postgres", "hi", {
  host: "localhost",
  dialect: "postgres",
});
(async () => {
  try {
    await sequelize.authenticate();
    let Students = sequelize.define("students", {
      name: { type: Sequelize.STRING },
      roll: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    });
    let Attendance = sequelize.define("attendance", {
      date: { type: Sequelize.DATE },
      roll: { type: Sequelize.INTEGER },
      month: { type: Sequelize.INTEGER },
    });
    await Students.sync({ force: true });
    await Attendance.sync({ force: true });
    // create 20 students
    for (let i = 0; i < 20; i++) {
      await Students.create({ name: faker.name.firstName() });
    }
    // create 100 attendances
    for (let i = 0; i < 100; i++) {
      let date = new Date(
        faker.date.between(
          "2022-01-01T00:00:00.000Z",
          "2022-03-01T00:00:00.000Z"
        )
      );
      await Attendance.create({
        date: date,
        month: date.getMonth() + 1,
        roll: Math.floor(Math.random() * 20),
      });
    }
  } catch (e) {
    console.log(e);
  }
})();
