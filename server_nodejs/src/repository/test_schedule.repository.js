const dbContext = require("../database/models/config/dbContext");
const { QueryTypes } = require("sequelize");
const test_schedules = dbContext.test_schedules;

module.exports = {
  create: async (test_schedule) => {
    const test_scheduleCreate = await test_schedules.create(test_schedule);
    return test_scheduleCreate;
  },
  update: async (test_schedule) => {
    await test_schedule.save();
    return test_schedule;
  },
  delete: async (id) => {
    const result = await test_schedules.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
  getById: async (id) => {
    const test_schedule = await test_schedules.findByPk(id);
    return test_schedule;
  },
  getAll: async () => {
    const query = `SELECT ts.*,se.semester as semester, CONCAT(se.year,' - ',se.year+1) as year
        FROM test_schedules as ts 
        INNER JOIN semesters as se ON ts.semester_id = se.id
        ORDER BY ts.date DESC;`;
    const listtest_schedule = await test_schedules.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listtest_schedule;
  },
};
