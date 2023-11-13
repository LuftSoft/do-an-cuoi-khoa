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
    const query = `SELECT questions.*, subjects.id as subject_id 
        FROM questions, chapters, subjects 
        WHERE questions.chapter_id = chapters.id AND chapters.subject_id = subjects.id AND questions.id = ${id}`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question[0];
  },
  getByListId: async (ids) => {
    if (ids.length === 0) return [];
    const query = `SELECT questions.*, chapters.name as chapter_name
        FROM questions, chapters
        WHERE questions.chapter_id = chapters.id AND questions.id in (${ids})`;
    const data = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getBySubjectId: async (id) => {
    const query = `SELECT questions.*, chapters.name as chapter_name, subjects.name as subject_name,subjects.id as subject_id 
    FROM questions, subjects, chapters 
    WHERE questions.chapter_id = chapters.id AND chapters.subject_id = subjects.id AND chapters.subject_id = '${id}'`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question;
  },
  getByChapterId: async (ids) => {
    if (ids === 0) return [];
    const query = `SELECT questions.*, chapters.name as chapter_name 
    FROM questions, chapters 
    WHERE questions.chapter_id = chapters.id AND chapters.id in (${ids})`;
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
  createMultiple: async (query) => {
    const queryExe = `INSERT INTO questions(question,level,answer_a,answer_b,answer_c,answer_d,correct_answer,image,chapter_id,is_admin_create,user_create)
    VALUES ${query}`;
    return await questions.sequelize.query(queryExe, {
      type: QueryTypes.INSERT,
    });
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
