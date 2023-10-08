const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const testConverter = require('../service/converter/test.converter');
const tests = dbContext.tests;

module.exports = {
    getAll: async () => {
        const listtest = await tests.findAll();
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
                id: id
            },
            truncate: true
        });
        return result;
    }
}