const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const subjectConverter = require("../service/converter/subject.converter");
const subjects = dbContext.subjects;
const { QueryTypes } = require("sequelize");

module.exports = {
  create: async (subject) => {
    subject.id = Helpers.generateUiid(8);
    const subjectCreate = await subjects.create(subject);
    return subjectCreate;
  },
  update: async (subject) => {
    await subject.save();
    return subject;
  },
  delete: async (id) => {
    const query = `DELETE FROM subjects WHERE id = '${id}'`;
    const result = await subjects.sequelize.query(query, {
      type: QueryTypes.DELETE,
    });
    return result;
  },
  getById: async (id) => {
    const subject = await subjects.findByPk(id);
    return subject;
  },
  getAll: async () => {
    const query = `SELECT sj.*, dp.name as department_name FROM subjects as sj
        INNER JOIN departments as dp ON sj.department_id = dp.id`;
    const listsubject = await subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listsubject;
  },
};
