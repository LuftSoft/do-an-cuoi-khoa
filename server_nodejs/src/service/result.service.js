const resultRepository = require("../repository/result.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const resultConverter = require("./converter/result.converter");
const resultDetailService = require("./result_detail.service");
const fs = require("fs");
const PDFKit = require("pdfkit");
const path = require("path");
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
  exportTranscript: async (id) => {
    try {
      var resultDetails = await resultRepository.getByTestCreditClassesId(id);
      console.log(resultDetails);
      // Define table properties
      const tableTop = 200; // Y-coordinate where the table starts
      const tableLeft = 50; // X-coordinate where the table starts
      const cellPadding = 10; // Padding for cells
      const tableData = [["STT", "Họ và tên", "Email", "Mã sinh viên", "Điểm"]];
      for (let index = 0; index < resultDetails.length; index++) {
        tableData.push([
          index + 1,
          resultDetails[index]?.user_name,
          resultDetails[index]?.user_email,
          resultDetails[index]?.user_code,
          resultDetails[index]?.mark,
        ]);
      }
      const drawCell = (text, x, y, width, height, color) => {
        doc
          .rect(x, y, width, height)
          .fill(color ? color : "#fff")
          .stroke();
        doc.text(text, x + cellPadding, y + cellPadding);
      };
      const drawTable = () => {
        const tableWidth = 400; // Width of the table
        const tableHeight = 100; // Height of the table
        const cellWidth = tableWidth / tableData[0].length; // Width of each cell
        const cellHeight = tableHeight / tableData.length; // Height of each cell

        doc.lineWidth(1); // Set line width for the table
        // Loop through each row and column to draw the cells
        tableData.forEach((row, rowIndex) => {
          row.forEach((cell, columnIndex) => {
            const x = tableLeft + columnIndex * cellWidth;
            const y = tableTop + rowIndex * cellHeight;
            drawCell(
              cell,
              x,
              y,
              cellWidth,
              cellHeight,
              rowIndex === 0 ? "#99ddff" : false
            );
          });
        });
      };
      const doc = new PDFKit({
        margins: { top: 20, left: 20, bottom: 20, right: 20 },
      });
      doc.pipe(fs.createWriteStream("bang_diem_export.pdf"));
      ``;

      // Write content to the PDF
      //doc.setEncoding("ascii");
      const lightFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Light.ttf")
      );
      const regularFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Regular.ttf")
      );
      doc.registerFont("lightFont", lightFont);
      doc.registerFont("regularFont", regularFont);
      doc.font("lightFont").fontSize(12);
      doc.text("HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG", {
        continued: false,
      });
      doc.moveDown(1);
      doc.text("CƠ SỞ TẠI THÀNH PHỐ HỒ CHÍ MINH", {
        continued: false,
      });
      // doc.text(`Thời gian thi: ${test.time} phút`, {
      //   continued: false,
      //   align: "right",
      // });
      // doc.text(`KHOA: ${subject?.department_name?.toUpperCase()}`);
      // doc.text(`BỘ MÔN: ${subject?.name}`);
      doc.moveDown(1);
      doc.fontSize(10);
      doc.font("regularFont");
      drawTable();
      // Finalize the PDF
      doc.end();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        fs.readFileSync("bang_diem_export.pdf", { encoding: "base64" }),
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
