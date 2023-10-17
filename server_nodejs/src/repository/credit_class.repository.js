const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const credit_classes = dbContext.credit_classes;

module.exports = {
  create: async (credit_class) => {
    const credit_classCreate = await credit_classes.create(credit_class);
    return credit_classCreate;
  },
  update: async (credit_class) => {
    await credit_class.save();
    return credit_class;
  },
  delete: async (id) => {
    const result = await credit_classes.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
  getById: async (id) => {
    const credit_class = await credit_classes.findByPk(id);
    return credit_class;
  },
  getAll: async () => {
    const query = `SELECT cc.*, sj.name as subject_name, sm.semester as semester_semester, sm.year as semester_year
    FROM credit_classes as cc,subjects as sj, semesters as sm 
    WHERE cc.subject_id = sj.id AND cc.semester_id = sm.id `;
    const listcredit_class = await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listcredit_class;
  },
};
