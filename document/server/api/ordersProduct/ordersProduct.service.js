const utils = require("../../utils");
const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into orderProducts(userId, statusId, voucherId, addressUserId, note, isPaymentOnline, codeOrder) values(?,?,?,?,?,?,?)",
      [
        data.userId,
        data.statusId,
        data.voucherId,
        data.addressUserId,
        data.note,
        data.isPaymentOnline,
        data.codeOrder,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getorderProducts: (callBack) => {
    pool.query(
      "select id, userId, statusId, voucherId, addressUserId, note, isPaymentOnline, codeOrder from orderProducts",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getorderProductsById: (id, callBack) => {
    pool.query(
      "select userId, statusId, voucherId, addressUserId, note, isPaymentOnline, codeOrder from orderProducts where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getorderProductsByUserId: (userId, callBack) => {
    pool.query(
      "select id, statusId, voucherId, addressUserId, note, isPaymentOnline, codeOrder from orderProducts where userId=?",
      [userId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateorderProduct: (data, callBack) => {
    pool.query(
      "update orderProducts set userId =?,statusId =?,voucherId=?,addressUserId=?,note =?, isPaymentOnline =? where id=?",
      [
        data.userId,
        data.statusId,
        data.voucherId,
        data.addressUserId,
        data.note,
        data.isPaymentOnline,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteorderProduct: (data, callBack) => {
    pool.query(
      "delete from orderProducts where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
