const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const results = dbContext.results;

module.exports = {
    getAll: async () => {
        const listresult = await results.findAll();
        return listresult;
    },
    getById: async (id) => {
        const result = await results.findByPk(id);
        return result;
    },
    create: async (result) => {
        result.id = Helpers.generateUiid(8);
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
                id: id
            },
            truncate: true
        });
        return result;
    },

    /**/
    getresultGroupById: async (id) => {
        const result = await result_groups.findByPk(id);
        return result;
    },
    createresultGroup: async () => {

    },
    updateresultGroup: async () => {

    },
    deleteresultGroup: async () => {

    },

    /**/
    getresultQuestionById: async (id) => {
        const result = await result_details.findByPk(id);
        return result;
    },
    createresultQuestion: async (resultQuestion) => {
        const result = await result_details.create(resultQuestion);
        return result;
    },
    updateresultQuestion: async (resultQuestion) => {
        const result = await result_details.update(resultQuestion);
        return result;
    },
    deleteresultQuestion: async (id) => {
        const result = await result_details.destroy({
            where: {
                id: id
            },
        })
        return result;
    }
}