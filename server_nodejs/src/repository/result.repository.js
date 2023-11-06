const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const results = dbContext.results;

module.exports = {
  getAll: async () => {
    const data = await results.findAll();
    return data;
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
    const result = await results.destroy({
      where: {
        id: id,
      },
      truncate: true,
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
