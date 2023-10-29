const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const questionConverter = require("../service/converter/question.converter");
const questions = dbContext.questions;

module.exports = {
  getAll: async () => {
    const query = `SELECT questions.*, chapters.name as chapter_name, subjects.name as subject_name,subjects.id as subject_id 
        FROM questions, chapters, subjects 
        WHERE questions.chapter_id = chapters.id && chapters.subject_id = subjects.id`;
    const listquestion = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listquestion;
  },
  getById: async (id) => {
    const query = `SELECT questions.id, questions.level, questions.chapter_id, subjects.id as subject_id 
        FROM questions, chapters, subjects 
        WHERE questions.chapter_id = chapters.id AND chapters.subject_id = subjects.id AND questions.id = ${id}`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question[0];
  },
  getBySubjectId: async (id) => {
    const query = `SELECT questions.*, chapters.name as chapter_name, subjects.name as subject_name,subjects.id as subject_id 
    FROM questions, subjects, chapters 
    WHERE questions.chapter_id = chapters.id AND chapters.subject_id = '${id}'`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question;
  },
  findByPk: async (id) => {
    return await questions.findByPk(id);
  },
  create: async (question) => {
    const questionCreate = await questions.create(question);
    return questionCreate;
  },
  update: async (question) => {
    await question.save();
    return question;
  },
  delete: async (id) => {
    const result = await questions.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
};
