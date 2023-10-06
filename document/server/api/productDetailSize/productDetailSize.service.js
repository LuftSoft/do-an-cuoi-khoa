const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into productDetailSize(productDetailId,  width ,height,  sizeId  ) values(?,?,?,?)",
      [data.productDetailId, data.width, data.height, data.sizeId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsDetailSize: (callBack) => {
    pool.query(
      "select productDetailId, width ,height,  sizeId  from productDetailSize",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsDetailSizeById: (id, callBack) => {
    pool.query(
      "select productDetailId, width ,height,  sizeId   from productDetailSize where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateProductsDetailSize: (data, callBack) => {
    pool.query(
      "update productDetailSize set productDetailId =?,width =?,height=?,sizeId=? where id=?",
      [data.productDetailId, data.width, data.height, data.sizeId, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteProductsDetailSize: (data, callBack) => {
    pool.query(
      "delete from productDetailSize where id=?",
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
