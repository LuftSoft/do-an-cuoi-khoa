const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const tests = dbContext.tests;
const test_details = dbContext.test_details;
const test_credit_classes = dbContext.test_credit_classes;

module.exports = {
  getAll: async () => {
    const query = `SELECT t.*, sj.name as subject_name, sm.semester as semester_semester, sm.year as semester_year
        FROM tests as t 
        INNER JOIN semesters as sm ON t.semester_id = sm.id
        INNER JOIN subjects as sj ON t.subject_id = sj.id`;
    const listtest = await tests.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listtest;
  },
  getById: async (id) => {
    const test = await tests.findByPk(id);
    return test;
  },
  create: async (test) => {
    test.id = Helpers.generateUiid(8);
    const testCreate = await tests.create(test);
    return testCreate;
  },
  update: async (test) => {
    await test.save();
    return test;
  },
  delete: async (id) => {
    const result = await tests.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },

  /**/
  getTestGroupById: async (id) => {
    const result = await test_credit_classes.findByPk(id);
    return result;
  },
  getTestClassByTestId: async (id) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      WHERE tc.test_id = '${id}'`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  createTestClass: async (testGroup) => {
    const result = await test_credit_classes.create(testGroup);
    return result;
  },
  updateTestClass: async (testGroup) => {
    const result = await test_credit_classes.update(testGroup);
    return result;
  },
  deleteTestClass: async (id) => {
    return await test_credit_classes.destroy({ where: { id: id } });
  },

  /**/
  getTestQuestionById: async (id) => {
    const result = await test_details.findByPk(id);
    return result;
  },
  createTestQuestion: async (testQuestion) => {
    const result = await test_details.create(testQuestion);
    return result;
  },
  updateTestQuestion: async (testQuestion) => {
    const result = await test_details.update(testQuestion);
    return result;
  },
  deleteTestQuestion: async (id) => {
    const result = await test_details.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
