const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const credit_classes = dbContext.credit_classes;

module.exports = {
    create: async (credit_class) => {
        const credit_classCreate = await credit_classes.create(credit_class);
        return credit_classCreate;
    },
    update: async (credit_class) => {
        await credit_class.save();
        return credit_class;
    },
    delete: async (id) => {
        const result = await credit_classes.destroy({
            where: {
                id: id
            },
            truncate: true
        });
        return result;
    },
    getById: async (id) => {
        const credit_class = await credit_classes.findByPk(id);
        return credit_class;
    },
    getAll: async () => {
        const listcredit_class = await credit_classes.findAll();
        return listcredit_class;
    }
}