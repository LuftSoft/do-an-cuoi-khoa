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
const xlsx = require("xlsx");
const fs = require("fs");
const { json } = require("body-parser");
const testRepository = require("../repository/test.repository");

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
  getByChapterId: async (ids) => {
    return await questionRepository.getByChapterId(ids);
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
        throw new Error("Câu hỏi không tồn tại");
      }
      const canDelete = await questionRepository.canDelete(id);
      if (!canDelete) {
        throw new Error("Câu hỏi đã được sử dụng, không thể xóa");
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
  import: async (file) => {
    if (!file) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "Không có file nào được chọn"
      );
    } else {
      try {
        const workBook = xlsx.read(file.buffer, { type: "buffer" });
        const sheet = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheet];

        const jsonData = xlsx.utils.sheet_to_json(workSheet);
        console.log(jsonData);
        let total = jsonData.length;
        let successQ = 0,
          failedQ = 0;
        for (let row of jsonData) {
          try {
            await questionRepository.create({
              id: 0,
              question: row.question,
              level: row.level,
              correct_answer: row.correct_answer,
              answer_a: row.answer_a,
              answer_b: row.answer_b,
              answer_c: row.answer_c,
              answer_d: row.answer_d,
              image: null,
              chapter_id: row.chapter_id,
            });
            successQ++;
          } catch (err) {
            failedQ++;
          }
        }

        let resWorkBook = xlsx.utils.book_new();
        let sheetName = "Kết quả import";
        const resSheet = xlsx.utils.aoa_to_sheet([
          ["Kết quả import câu hỏi", ""],
          ["Thời gian", new Date().toString()],
          ["Tổng câu hỏi", total],
          ["Thành công", successQ],
          ["Thất bại", failedQ],
        ]);
        xlsx.utils.book_append_sheet(resWorkBook, resSheet, sheetName);
        const exportFilePath = "question_import_result.xlsx";
        xlsx.writeFile(resWorkBook, exportFilePath);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          fs.readFileSync("question_import_result.xlsx", {
            encoding: "base64",
          }),
          "ok"
        );
      } catch (err) {
        logger.error(`import question failed`);
        console.log(err);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          err.message
        );
      }
    }
  },
  export: async () => {
    try {
      const q = await questionRepository.getFirstNum(10);
      let data = [];
      if (q) {
        data.push([...Object.keys(q[0])]);
      }
      for (let item of q) {
        data.push([...Object.values(item)]);
      }
      const workBook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.aoa_to_sheet(data);
      xlsx.utils.book_append_sheet(workBook, workSheet, "Danh sách câu hỏi");
      //xlsx.write(workBook, { type: "buffer", bookType: "xlsx" })
      xlsx.writeFile(workBook, "question_export.xlsx");
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        fs.readFileSync("question_export.xlsx", { encoding: "base64" }),
        "export success"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "export failed"
      );
    }
  },
};
