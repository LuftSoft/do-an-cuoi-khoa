const { QueryTypes, Sequelize } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const results = dbContext.results;
const result_details = dbContext.result_details;
const test_credit_classes = dbContext.test_credit_classes;
const resultDetailRepository = require("./result_detail.repository");

module.exports = {
  getAll: async () => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, sj.name as subject_name,
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN subjects AS sj ON cc.subject_id = sj.id`;
    return await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getByTestClassId: async (id) => {
    const query = `SELECT rs.* 
        FROM results as rs INNER JOIN tests as t
        ON rs.test_id = t.id`;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  getAllResultByUserId: async (id) => {
    const query = `SELECT tc.*, rs.id as result_id,rs.user_id as user_id, CONCAT('Học kỳ ',sm.semester,' - Năm ',sm.year) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time
      FROM test_credit_classes AS tc
      INNER JOIN results AS rs ON rs.test_credit_classes_id = tc.id
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
  getByTestCreditClassesId: async (id) => {
    const query = `SELECT rs.*, CONCAT(us.firstName,' ', us.lastName) as user_name, us.code as user_code 
    FROM results as rs
    INNER JOIN test_credit_classes as tc ON rs.test_credit_classes_id = tc.id
    INNER JOIN users as us on rs.user_id = us.id
    WHERE tc.id = ${id}`;
    const data = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getById: async (id) => {
    const result = await results.findByPk(id);
    return result;
  },
  getByTestId: async (id) => {
    const query = `SELECT rs.* 
        FROM results as rs INNER JOIN tests as t
        ON rs.test_id = t.id`;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  create: async (result) => {
    const resultCreate = await results.create(result);
    return resultCreate;
  },
  update: async (result) => {
    await result.save();
    return result;
  },
  delete: async (id) => {
    const details = await resultDetailRepository.getByResultId(id);
    if (details.length > 0) {
      await resultDetailRepository.deleteByResultId(id);
    }
    const result = await results.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },

  /**/
  getResultGroupById: async (id) => {
    const result = await result_groups.findByPk(id);
    return result;
  },
  createResultGroup: async () => {},
  updateResultGroup: async () => {},
  deleteResultGroup: async () => {},

  /**/
  getResultQuestionById: async (id) => {
    const result = await result_details.findByPk(id);
    return result;
  },
  getResultQuestionByResultId: async (id) => {
    const query = ``;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  createResultQuestion: async (resultQuestion) => {
    const result = await result_details.create(resultQuestion);
    return result;
  },
  createMultiResultQuestion: async (query) => {
    console.log(query);
    const exeQuery = `INSERT INTO result_details(result_id,question_id,position,choose) VALUES ${query};`;
    await result_details.sequelize.query(exeQuery, { type: QueryTypes.INSERT });
    return true;
  },
  updateResultQuestion: async (resultQuestion) => {
    const result = await result_details.update(resultQuestion);
    return result;
  },
  deleteResultQuestion: async (id) => {
    const result = await result_details.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
