const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const chapterConverter = require('../service/converter/chapter.converter');
const chapters = dbContext.chapters;

module.exports = {
    getAll: async () => {
        const listchapter = await chapters.findAll();
        return listchapter;
    },
    getById: async (id) => {
        const chapter = await chapters.findByPk(id);
        return chapter;
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
                id: id
            },
            truncate: true
        });
        return result;
    }
}