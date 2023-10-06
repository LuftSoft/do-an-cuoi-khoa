const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into productsDetail(productId, description, nameDetail,imageproduct, originalPrice ) values(?,?,?,?,?)",
      [
        data.productId,
        data.description,
        data.nameDetail,
        data.imageproduct,
        data.originalPrice,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsDetail: (callBack) => {
    pool.query(
      "select id, productId, description, nameDetail, imageproduct, originalPrice from productsDetail",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsDetailById: (id, callBack) => {
    pool.query(
      "select p.id, p.productId, q.name, p.description, p.nameDetail,p.imageproduct, p.originalPrice, q.agetypesId, o.name as category  from productsDetail p inner join products q on p.productId = q.id  inner join agetypes o on q.agetypesId = o.id where p.productId=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateProductsDetail: (data, callBack) => {
    pool.query(
      "update productsDetail set productId =?,description =?,nameDetail=?, imageproduct=?, originalPrice =? where id=?",
      [
        data.productId,
        data.description,
        data.nameDetail,
        data.imageproduct,
        data.originalPrice,
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
  deleteProductsDetail: (data, callBack) => {
    pool.query(
      "delete from productsDetail where id=?",
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
