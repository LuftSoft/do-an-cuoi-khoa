const resultDetailRepository = require('../repository/result_detail.repository');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { CONFIG } = require('../shared/common.constants');
const { Helpers, logger } = require('../extension/helper');
const resultDetailConverter = require('./converter/result_detail.converter');

module.exports = {
    getAll: async () => {
        try {
            var data = await resultDetailRepository.getAll();
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('get all resultDetail failed!');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    getOne: async (id) => {
        try {
            var data = await resultDetailRepository.getById(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`get resultDetail with id "${id}" failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    create: async (resultDetail) => {
        try {
            let data = await resultDetailRepository.create(resultDetail);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create resultDetail failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    update: async (resultDetail) => {
        try {
            let resultDetailModel = await resultDetailRepository.getById(resultDetail.id);
            if (!resultDetailModel) {
                throw new Error('Chi tiết kết quả không tồn tại');
            }
            resultDetailConverter.convertDataToModel(resultDetailModel, resultDetail);
            var data = await resultDetailRepository.update(resultDetailModel);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`update resultDetail failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    delete: async (id) => {
        try {
            var data = await resultDetailRepository.delete(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`delete resultDetail with id ${id} failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
}