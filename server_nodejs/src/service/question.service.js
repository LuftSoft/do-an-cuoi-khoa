const questionRepository = require("../repository/question.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const authService = require("./common/auth.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const questionConverter = require("./converter/question.converter");
const userService = require("./user.service");

module.exports = {
  getAll: async () => {
    try {
      var data = await questionRepository.getAll();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all question failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getBySubjectId: async (id) => {
    return await questionRepository.getBySubjectId(id);
  },
  getOne: async (id) => {
    try {
      var data = await questionRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get question with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (question) => {
    try {
      const userId = question.userId;
      const user = await userService.getById(userId);
      if (!user) {
        logger.error(`question service - user with id ${userId} is undefined`);
      }
      const role = user.roles[0]?.name;
      console.log;
      if (role === CONFIG.ROLE.ADMIN) {
        question.is_admin_create = true;
      }
      question.user_create = userId;
      let data = await questionRepository.create(question);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create question failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (question) => {
    try {
      let questionModel = await questionRepository.findByPk(question.id);
      if (!questionModel) {
        throw new Error("Chương không tồn tại");
      }
      questionConverter.convertDataToModel(questionModel, question);
      var data = await questionRepository.update(questionModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update question failed`);
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
      let questionModel = await questionRepository.getById(id);
      if (!questionModel) {
        throw new Error("Chương không tồn tại");
      }
      var data = await questionRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
