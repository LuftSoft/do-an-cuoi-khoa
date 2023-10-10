const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const test_schedules = dbContext.test_schedules;

module.exports = {
    create: async (test_schedule) => {
        const test_scheduleCreate = await test_schedules.create(test_schedule);
        return test_scheduleCreate;
    },
    update: async (test_schedule) => {
        await test_schedule.save();
        return test_schedule;
    },
    delete: async (id) => {
        const result = await test_schedules.destroy({
            where: {
                id: id
            },
            truncate: true
        });
        return result;
    },
    getById: async (id) => {
        const test_schedule = await test_schedules.findByPk(id);
        return test_schedule;
    },
    getAll: async () => {
        const listtest_schedule = await test_schedules.findAll();
        return listtest_schedule;
    }
}