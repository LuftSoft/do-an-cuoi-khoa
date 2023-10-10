const resultRepository = require('../repository/result.repository');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { CONFIG } = require('../shared/common.constants');
const { Helpers, logger } = require('../extension/helper');
const resultConverter = require('./converter/result.converter');

module.exports = {
    getAll: async () => {
        try {
            var data = await resultRepository.getAll();
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('get all result failed!');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    getOne: async (id) => {
        try {
            var data = await resultRepository.getById(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`get result with id "${id}" failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    create: async (result) => {
        try {
            let data = await resultRepository.create(result);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create result failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    update: async (result) => {
        try {
            let resultModel = await resultRepository.getById(result.id);
            if (!resultModel) {
                throw new Error('Chương không tồn tại');
            }
            resultConverter.convertDataToModel(resultModel, result);
            var data = await resultRepository.update(resultModel);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`update result failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    delete: async (id) => {
        try {
            let resultModel = await resultRepository.getById(id);
            if (!resultModel) {
                throw new Error('Chương không tồn tại');
            }
            var data = await resultRepository.delete(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`delete result with id ${id} failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
}