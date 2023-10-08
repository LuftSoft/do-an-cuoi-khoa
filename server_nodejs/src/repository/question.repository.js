const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const questionConverter = require('../service/converter/question.converter');
const questions = dbContext.questions;

module.exports = {
    getAll: async () => {
        const listquestion = await questions.findAll();
        return listquestion;
    },
    getById: async (id) => {
        const question = await questions.findByPk(id);
        return question;
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
                id: id
            },
            truncate: true
        });
        return result;
    }
}