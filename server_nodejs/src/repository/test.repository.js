const { QueryTypes, Op } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const questionRepository = require("./question.repository");
const tests = dbContext.tests;
const test_details = dbContext.test_details;
const test_credit_classes = dbContext.test_credit_classes;
const questions = dbContext.questions;

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
    var test = await tests.findByPk(id, {});
    var testDetails = await test_details.findAll({
      attributes: ["question_id"],
      where: { test_id: test?.id },
    });
    if (!testDetails) testDetails = [];
    testDetails = testDetails.map((item) => item.question_id);
    const questions = await questionRepository.getByListId(
      testDetails.join(",")
    );
    test.dataValues.questions = questions;
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
  getTestClasses: async () => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
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
  getTestClassesById: async (id) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      WHERE tc.id = '${id}'`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getAllTestByUserId: async (id) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN credit_class_details as cd ON cc.id = cd.credit_class_id
      INNER JOIN users as us ON cd.user_id = us.id
      WHERE us.id = '${id}';`;
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
  createMultiTestQuestion: async (query) => {
    const exeQuery = `INSERT INTO test_details(id, test_id, question_id, test_details.order) VALUES ${query}`;
    return await test_details.sequelize.query(exeQuery, {
      type: QueryTypes.INSERT,
    });
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
