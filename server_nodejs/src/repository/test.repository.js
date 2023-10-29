const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const tests = dbContext.tests;
const test_details = dbContext.test_details;
const test_groups = dbContext.test_groups;

module.exports = {
  getAll: async () => {
    const query = `SELECT t.*, sj.name as subject_name
        FROM tests as t 
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
      truncate: true,
    });
    return result;
  },

  /**/
  getTestGroupById: async (id) => {
    const result = await test_groups.findByPk(id);
    return result;
  },
  createTestGroup: async (testGroup) => {
    const result = await test_groups.create(testGroup);
    return result;
  },
  updateTestGroup: async (testGroup) => {
    const result = await test_groups.update(testGroup);
    return result;
  },
  deleteTestGroup: async (id) => {
    return await test_groups.destroy({ where: { id: id } });
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
