const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const questions = dbContext.questions;

module.exports = {
  /**/
  getFourTopInfo: async () => {
    const query = `
    SELECT (SELECT count(*) FROM questions) AS questions, 
    (SELECT count(*) FROM tests) AS tests, 
    (SELECT count(*) FROM users) AS users, 
    (SELECT count(*) FROM results) AS results;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info[0] || {};
  },
  getPieChartMark: async () => {
    const query = `SELECT 
        (SUM(CASE WHEN mark<1 THEN 1 ELSE 0 END)) AS under_one,
        (SUM(CASE WHEN mark BETWEEN 1 AND 4 THEN 1 ELSE 0 END)) AS one_four,
        (SUM(CASE WHEN mark BETWEEN 4 AND 6.5 THEN 1 ELSE 0 END)) AS four_six_point_five,
        (SUM(CASE WHEN mark BETWEEN 6.5 AND 8 THEN 1 ELSE 0 END)) AS six_point_five_eight,
        (SUM(CASE WHEN mark BETWEEN 8 AND 9 THEN 1 ELSE 0 END)) AS eight_nine,
        (SUM(CASE WHEN mark > 9 THEN 1 ELSE 0 END)) AS above_nine
        FROM results;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info[0] || {};
  },
  getBarChartSemester: async () => {
    const query = `SELECT COUNT(rs.id) AS num, se.* FROM results AS rs 
    INNER JOIN test_credit_classes AS tc ON rs.test_credit_classes_id = tc.id
    INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
    RIGHT JOIN (SELECT * FROM semesters ORDER BY id DESC LIMIT 10) AS se ON ts.semester_id = se.id
    group by se.id;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info || [];
  },
};
