const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const subjectConverter = require('../service/converter/subject.converter');
const subjects = dbContext.subjects;

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
        const result = await subjects.destroy({
            where: {
                id: id
            },
            truncate: true
        });
        return result;
    },
    getById: async (id) => {
        const subject = await subjects.findByPk(id);
        return subject;
    },
    getAll: async () => {
        const listsubject = await subjects.findAll();
        return listsubject;
    }
}