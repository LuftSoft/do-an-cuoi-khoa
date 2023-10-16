const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const chapterConverter = require("../service/converter/chapter.converter");
const chapters = dbContext.chapters;

module.exports = {
  getAll: async () => {
    const query =
      "select chapters.*, subjects.name as subject_name from chapters, subjects where chapters.subject_id = subjects.id";
    const listchapter = await chapters.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log(listchapter);
    return listchapter;
  },
  getById: async (id) => {
    const chapter = await chapters.findByPk(id);
    return chapter;
  },
  getBySubjectId: async (id) => {
    const listchapter = await chapters.findAll({
      where: {
        subject_id: id,
      },
    });
    return listchapter;
  },
  create: async (chapter) => {
    const chapterCreate = await chapters.create(chapter);
    return chapterCreate;
  },
  update: async (chapter) => {
    await chapter.save();
    return chapter;
  },
  delete: async (id) => {
    const result = await chapters.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
};
