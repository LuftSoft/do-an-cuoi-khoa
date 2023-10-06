const utils = require("../../utils");
const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into orderDetail(orderId, productId, quantity, realPrice ) values(?,?,?,?)",
      [data.orderId, data.productId, data.quantity, data.realPrice],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getorderProductDetail: (callBack) => {
    pool.query(
      "select id, orderId, productId, quantity, realPrice from orderDetail",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getorderProductDetailById: (id, callBack) => {
    pool.query(
      "select id, orderId, productId, quantity, realPrice from orderDetail where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getorderProductDetailByOrderId: (id, callBack) => {
    pool.query(
      "SELECT p.id, p.quantity, p.realPrice, q.name, originalPrice, o.imageproduct, m.codeOrder    FROM orderDetail p     INNER JOIN products q       ON p.productId = q.id INNER JOIN productsDetail o ON q.id = o.productId INNER JOIN orderProducts m ON m.id = p.orderId where p.orderId = ?;",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getorderProductDetailByUserId: (id, callBack) => {
    pool.query(
      "SELECT p.id, p.quantity, p.realPrice, q.name, originalPrice, o.imageproduct, m.codeOrder, m.createAt   FROM orderDetail p     INNER JOIN products q       ON p.productId = q.id INNER JOIN productsDetail o ON q.id = o.productId INNER JOIN orderProducts m ON m.id = p.orderId where m.userId = ?;",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateorderProductDetail: (data, callBack) => {
    pool.query(
      "update orderDetail set orderId =?,productId =?,quantity=?,realPrice=? where id=?",
      [data.orderId, data.productId, data.quantity, data.realPrice, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteorderProductDetail: (data, callBack) => {
    pool.query(
      "delete from orderDetail where id=?",
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
