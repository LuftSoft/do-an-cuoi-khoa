const dbContext = require('../database/models/config/dbContext');
const { Helpers } = require('../extension/helper');
const groupConverter = require('../service/converter/group.converter');
const groups = dbContext.groups;
const group_details = dbContext.group_details;

module.exports = {
    create: async (group) => {
        const groupCreate = await groups.create(group);
        return groupCreate;
    },
    update: async (group) => {
        await group.save();
        return group;
    },
    delete: async (id) => {
        const result = await groups.destroy({
            where: {
                id: id
            },
            truncate: true
        });
        return result;
    },
    getById: async (id) => {
        const group = await groups.findByPk(id);
        return group;
    },
    getAll: async () => {
        const listgroup = await groups.findAll();
        return listgroup;
    },
    /**/
    createUserGroup: async (userGroup) => {
        const groupCreate = await group_details.create(userGroup);
        return groupCreate;
    },
    banUserGroup: async () => {

    },
    deleteUserGroup: async () => {

    }
}