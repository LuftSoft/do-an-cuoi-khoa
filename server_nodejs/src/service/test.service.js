const testRepository = require('../repository/test.repository');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { CONFIG } = require('../shared/common.constants');
const { Helpers, logger } = require('../extension/helper');
const testConverter = require('./converter/test.converter');

module.exports = {
    getAll: async () => {
        try {
            var data = await testRepository.getAll();
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('get all test failed!');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    getOne: async (id) => {
        try {
            var data = await testRepository.getById(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`get test with id "${id}" failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    create: async (test) => {
        try {
            let data = await testRepository.create(test);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create test failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    update: async (test) => {
        try {
            let testModel = await testRepository.getById(test.id);
            if (!testModel) {
                throw new Error('Đề thi không tồn tại');
            }
            testConverter.convertDataToModel(testModel, test);
            var data = await testRepository.update(testModel);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`update test failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    delete: async (id) => {
        try {
            let testModel = await testRepository.getById(id);
            if (!testModel) {
                throw new Error('Đề thi không tồn tại');
            }
            var data = await testRepository.delete(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`delete test with id ${id} failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
}