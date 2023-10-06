const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(

    
     
      "insert into receiptDetail(receiptId,productId,quantity,price) values(?,?,?,?)",
      [
        data.receiptId,
        data.productId,
        data.quantity,
        data.price,
      
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getReceiptDetails: (callBack) => {
    pool.query(
      "select receiptId,productId,quantity,price from receiptDetail",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getReceiptDetailById: (id, callBack) => {
    pool.query(
      "select receiptId,productId,quantity,price  from receiptDetail where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateReceiptDetail: (data, callBack) => {
    pool.query(
      "update receiptDetail set receiptId =?,productId =?,quantity =?,price =? where id=?",
      [
        data.receiptId,
        data.productId,
        data.quantity,
        data.price,
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
  deleteReceiptDetail: (data, callBack) => {
    pool.query(
      "delete from receiptDetail where id=?",
      [data],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
