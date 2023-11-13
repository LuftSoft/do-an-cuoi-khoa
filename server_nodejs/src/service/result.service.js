const resultRepository = require("../repository/result.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const resultConverter = require("./converter/result.converter");
const resultDetailService = require("./result_detail.service");

module.exports = {
  getAll: async () => {
    try {
      var data = await resultRepository.getAll();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all result failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getOne: async (id) => {
    try {
      var data = await resultRepository.getById(id);
      if (!data) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          CONFIG.ERROR.NOT_EXISTS
        );
      }
      const detail = await resultDetailService.getByResultId(id);
      data.dataValues.detail = detail;
      console.log("result data bang: ", data);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data.dataValues,
        null
      );
    } catch (err) {
      logger.error(`get result with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getByUserId: async (id) => {
    try {
      var data = await resultRepository.getAllResultByUserId(id);
      if (!data) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          CONFIG.ERROR.NOT_EXISTS
        );
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get result with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getByTestCreditClassesId: async (id) => {
    try {
      var data = await resultRepository.getByTestCreditClassesId(id);
      if (!data) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          CONFIG.ERROR.NOT_EXISTS
        );
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get result with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (result) => {
    var id = "";
    try {
      let query = "";
      let correct_answer = 0;
      for (let q of result.questions) {
        if (q.choose === q.correct_answer) correct_answer++;
      }
      const resultValue = {
        test_credit_classes_id: result.test_credit_class_id,
        user_id: result.user_id,
        mark:
          (
            (result.total_mark * correct_answer) /
            result.questions.length
          ).toFixed(2) || 0,
        start_time: result.test_schedule_date,
      };
      let data = await resultRepository.create(resultValue);
      console.log("response result create id", data);
      id = data.dataValues?.id;
      console.log("id bang:", id);
      console.log("create result success");
      for (let q of result.questions) {
        query += `(${id},${q.question_id},${q.position},${
          q.choose ? `'${q.choose}'` : null
        }),`;
      }
      // result.questions.forEach((q) => {
      //   query += `(${id},${q.question_id},${q.position},'${q.choose || ""}'),`;
      // });
      query = query.slice(0, -1);
      console.log("query bang: ", query);
      if (query.length === 0) {
        //need delete here
      }
      const resultDetail = await resultRepository.createMultiResultQuestion(
        query
      );
      console.log("create result detail success");
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create result failed");
      console.log(err);
      console.log("result id need delete: ", id);
      await resultRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (result) => {
    try {
      let resultModel = await resultRepository.getById(result.id);
      if (!resultModel) {
        throw new Error("Chương không tồn tại");
      }
      resultConverter.convertDataToModel(resultModel, result);
      var data = await resultRepository.update(resultModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update result failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  delete: async (id) => {
    try {
      let resultModel = await resultRepository.getById(id);
      if (!resultModel) {
        throw new Error("Chương không tồn tại");
      }
      var data = await resultRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete result with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
