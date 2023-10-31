const testRepository = require("../repository/test.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const testConverter = require("./converter/test.converter");
const questionService = require("./question.service");
const { CONSTANTS } = require("../shared/constant");
const findQuestionByLevel = (questions, level) => {
  const question = questions.find((item) => (item.level = level));
  questions = questions.filter((item) => item.id != question?.id);
  return question;
};
module.exports = {
  getAll: async () => {
    try {
      var data = await testRepository.getAll();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all test failed!");
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
      var data = await testRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get test with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (test) => {
    try {
      let data = await testRepository.create(test);
      if (data) {
        var questions = await questionService.getBySubjectId(test.subject_id);
        questions = questions.filter((item) =>
          data.chapters.includes(item.chapter_id)
        );
        let order = 0;
        for (let i = 0; i < Number.parseInt(data.easy_question); i++) {
          const question = findQuestionByLevel(
            questions,
            CONSTANTS.QUESTION.LEVEL.EASY
          );
          if (!question) continue;
          await testRepository.createTestQuestion({
            test_id: data.id,
            question__id: question.id,
            order: order,
          });
          order++;
        }
        for (let i = 0; i < Number.parseInt(data.medium_question); i++) {
          const question = findQuestionByLevel(
            questions,
            CONSTANTS.QUESTION.LEVEL.EASY
          );
          if (!question) continue;
          await testRepository.createTestQuestion({
            test_id: data.id,
            question__id: question.id,
            order: order,
          });
          order++;
        }
        for (let i = 0; i < Number.parseInt(data.difficult_question); i++) {
          const question = findQuestionByLevel(
            questions,
            CONSTANTS.QUESTION.LEVEL.EASY
          );
          if (!question) continue;
          await testRepository.createTestQuestion({
            test_id: data.id,
            question__id: question.id,
            order: order,
          });
          order++;
        }
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create test failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (test) => {
    try {
      let testModel = await testRepository.getById(test.id);
      if (!testModel) {
        throw new Error("Đề thi không tồn tại");
      }
      testConverter.convertDataToModel(testModel, test);
      var data = await testRepository.update(testModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test failed`);
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
      let testModel = await testRepository.getById(id);
      if (!testModel) {
        throw new Error("Đề thi không tồn tại");
      }
      var data = await testRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  /**/
  getTestClassByTestId: async (id) => {
    try {
      let data = await testRepository.getTestClassByTestId(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  createTestClass: async (testGroup) => {
    try {
      let data = await testRepository.createTestClass(testGroup);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateTestClass: async (testClass) => {
    try {
      let data = await testRepository.createTestClass(testClass);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  deleteTestClass: async (id) => {
    try {
      let data = await testRepository.deleteTestClass(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },

  /**/
  createTestQuestion: async (testQuestion) => {
    try {
      let data = await testRepository.createTestQuestion(testQuestion);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create test detail failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateTestQuestion: async (testQuestion) => {
    try {
      let testModel = await testRepository.getTestQuestionById(testQuestion.id);
      if (!testModel) {
        throw new Error("Chi tiết đề thi không tồn tại");
      }
      testConverter.convertDataToModel(testModel, test);
      var data = await testRepository.update(testModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test question failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  deleteTestQuestion: async () => {
    try {
      let testModel = await testRepository.getTestQuestionById(id);
      if (!testModel) {
        throw new Error("Chi tiết đề thi không tồn tại");
      }
      var data = await testRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
