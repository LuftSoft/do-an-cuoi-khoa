const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const users = dbContext.users;

module.exports = {
    create: async (user) => {
        user.id = Helpers.generateUiid(8);
        user.age = 1;
        const userCreate = await users.create(user);
        return userCreate;
    },
    update: async (user) => {
        let isExists = await users.findByPk(user.id);
        if (isExists) isExists = user;
        await isExists.save();
        return isExists;
    },
    delete: async (id) => {
        const result = await users.destroy({
            where: {
                id: id
            },
            truncate: true
        });
        return result;
    },
    getById: async (id) => {
        const user = await users.findByPk(id);
        return user;
    },
    getByEmail: async (email) => {
        const user = await users.findOne({
            where: {
                email: email
            }
        });
        return user;
    },
    getAll: async () => {
        const listUser = await users.findAll();
        return listUser;
    }
}