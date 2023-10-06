const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(

      
     
      "insert into receipt(userId ,supplierId) values(?,?)",
      [
        data.userId,
        data.supplierId,
      
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getReceipts: (callBack) => {
    pool.query(
      "select userId ,supplierId from receipt",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getReceiptById: (id, callBack) => {
    pool.query(
      "select userId ,supplierId  from receipt where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateReceipt: (data, callBack) => {
    pool.query(
      "update receipt set userId =?,supplierId =? where id=?",
      [
        data.userId,
        data.supplierId,
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
  deleteReceipt: (id, callBack) => {
    pool.query(
      "delete from receipt where id=?",
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
