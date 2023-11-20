const testRepository = require("../repository/test.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const testConverter = require("./converter/test.converter");
const questionService = require("./question.service");
const { CONSTANTS } = require("../shared/constant");
const fs = require("fs");
const findQuestionByLevel = (questions, level) => {
  const question = questions.find((item) => (item.level = level));
  questions = questions.filter((item) => item.id != question?.id);
  return question;
};
const PDFKit = require("pdfkit");
const path = require("path");
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
      //option ko auto create question
      if (!test.auto_generate_question) {
        let data = await testRepository.create(test);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          data,
          null
        );
      }
      //option con lai
      var questions = await questionService.getByChapterId(test.chapters);
      questions = questions.filter((item) =>
        test.chapters.includes(item.chapter_id)
      );
      const EASY_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.EASY
      );
      const MEDIUM_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.MEDIUM
      );
      const DIFFICULT_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.DIFFICULT
      );
      const EASY_QUESTION_COUNT = Number.parseInt(test.easy_question);
      const MEDIUM_QUESTION_COUNT = Number.parseInt(test.medium_question);
      const DIFFICULT_QUESTION_COUNT = Number.parseInt(test.difficult_question);
      if (EASY_QUESTION_COUNT > EASY_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi dễ"
        );
      }
      if (MEDIUM_QUESTION_COUNT > MEDIUM_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi vừa"
        );
      }
      if (DIFFICULT_QUESTION_COUNT > DIFFICULT_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi khó"
        );
      }
      console.log(test);
      console.log(questions);
      let data = await testRepository.create(test);
      let query = "";
      let orderCount = 1;
      const RANDOM_EASY = Helpers.getRandomItemsFromArray(
        EASY_QUESTION,
        EASY_QUESTION_COUNT
      );
      const RANDOM_MEDIUM = Helpers.getRandomItemsFromArray(
        MEDIUM_QUESTION,
        MEDIUM_QUESTION_COUNT
      );
      const RANDOM_DIFFICULT = Helpers.getRandomItemsFromArray(
        DIFFICULT_QUESTION,
        DIFFICULT_QUESTION_COUNT
      );
      for (let q of RANDOM_EASY) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      for (let q of RANDOM_MEDIUM) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      for (let q of RANDOM_DIFFICULT) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      query = query.slice(0, -1);
      console.log(query);
      const testDetails = await testRepository.createMultiTestQuestion(query);
      if (!testDetails) {
        //delete test here
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
  getTestClasses: async () => {
    try {
      let data = await testRepository.getTestClasses();
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
  getTestClassesById: async (id) => {
    try {
      let data = await testRepository.getTestClassesById(id);
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
  getAllTestByUserId: async (id) => {
    try {
      let data = await testRepository.getAllTestByUserId(id);
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
  export: async (id) => {
    try {
      let test = await testRepository.getById(id);
      test = test.dataValues;
      const doc = new PDFKit({
        margins: { top: 20, left: 20, bottom: 20, right: 20 },
      });
      doc.pipe(fs.createWriteStream("test_export.pdf"));

      // Write content to the PDF
      //doc.setEncoding("ascii");
      const lightFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Light.ttf")
      );
      const regularFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Regular.ttf")
      );
      const optionWidth = doc
        .fontSize(12)
        .widthOfString("HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG");
      doc.registerFont("lightFont", lightFont);
      doc.registerFont("regularFont", regularFont);
      doc.font("lightFont").fontSize(12);
      doc.text("HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG", {
        continued: true,
      });
      doc.text(test.name.toUpperCase(), { continued: false, align: "right" });
      doc.text("CƠ SỞ TẠI THÀNH PHỐ HỒ CHÍ MINH", {
        continued: true,
        indent: 60,
      });
      doc.text(`Thời gian thi: ${test.time} phút`, {
        continued: false,
        align: "right",
      });
      doc.text("KHOA: CÔNG NGHỆ THÔNG TIN 2");
      doc.text("BỘ MÔN: Cấu trúc dữ liệu và giải thuật");
      //header

      doc.text("MSSV: ........................................", {
        continued: true,
      });
      doc.text(
        "Họ và tên: .........................................................................................."
      );
      doc.moveDown(1);
      doc.font("regularFont").text("Đề thi", { align: "center" });
      const questions = test.questions;
      for (let i = 0; i < questions.length; i++) {
        doc.fontSize(10);
        doc
          .font("regularFont")
          .text(`Câu ${i + 1}: `, { align: "left", continued: true });
        doc
          .font("lightFont")
          .text(`${questions[i].question}.`, { align: "left" });
        doc
          .font("regularFont")
          .text(`A.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_a}`);
        doc
          .font("regularFont")
          .text(`B.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_b}`);
        doc
          .font("regularFont")
          .text(`C.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_c}`);
        doc
          .font("regularFont")
          .text(`D.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_d}`);
        doc.moveDown(1);
      }
      // Finalize the PDF
      doc.end();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        fs.readFileSync("test_export.pdf", { encoding: "base64" }),
        "export file success"
      );
    } catch (err) {
      logger.error(`failed to get test question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
