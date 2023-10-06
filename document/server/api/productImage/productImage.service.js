const express = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into productImages(caption, productDetailId, image  ) values(?,?,?)",
      [data.caption, data.productDetailId, data.image],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsImages: (callBack) => {
    pool.query(
      "select caption, productDetailId, image  from productImages",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsImagesById: (id, callBack) => {
    pool.query(
      "select caption, productDetailId, image   from productImages where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateProductsImages: (data, callBack) => {
    pool.query(
      "update productImages set caption =?,productDetailId =?,image=? where id=?",
      [data.caption, data.productDetailId, data.image, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteProductsImages: (data, callBack) => {
    pool.query(
      "delete from productImages where id=?",
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
