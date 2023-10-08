const groupRepository = require('../repository/group.repository');
var jwt = require('jsonwebtoken');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { CONFIG } = require('../shared/common.constants');
const { Helpers, logger } = require('../extension/helper');
const groupConverter = require('./converter/group.converter');

module.exports = {
    getAll: async () => {
        try {
            var data = await groupRepository.getAll();
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('get all group failed!');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    getOne: async (id) => {
        try {
            var data = await groupRepository.getById(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`get group with id "${id}" failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    create: async (group) => {
        try {
            let data = await groupRepository.create(group);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create group failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    update: async (group) => {
        try {
            let groupModel = await groupRepository.getById(group.id);
            if (!groupModel) {
                throw new Error('Nhóm không tồn tại');
            }
            groupConverter.convertDataToModel(groupModel, group);
            var data = await groupRepository.update(groupModel);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`update group failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    delete: async (id) => {
        try {
            let groupModel = await groupRepository.getById(id);
            if (!groupModel) {
                throw new Error('Nhóm không tồn tại');
            }
            var data = await groupRepository.delete(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`delete group with id ${id} failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    /* */
    createUserGroup: async (group) => {
        try {
            let data = await groupRepository.create(group);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create group failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    banUserGroup: async () => {

    },
    deleteUserGroup: async () => {

    }
}