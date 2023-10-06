const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into products(name ,contentHTML ,contentMarkdown, categoryId, agetypesId, view,madeby ,material , brandId ) values(?,?,?,?,?,?,?,?,?)",
      [
        data.name,
        data.contentHTML,
        data.contentMarkdown,
        data.categoryId,
        data.agetypesId,
        data.view,
        data.madeby,
        data.material,
        data.brandId,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProducts: (callBack) => {
    pool.query(
      "select id, name ,contentHTML ,contentMarkdown , categoryId, agetypesId, view,madeby ,material , brandId from products",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getProductById: (id, callBack) => {
    pool.query(
      "select id, name ,contentHTML ,contentMarkdown, categoryId, agetypesId, view, madeby ,material , brandId from products where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  getAllProductWithPrice: (callBack) => {
    pool.query(
      "SELECT p.id, p.name, p.categoryId,p.agetypesId, q.nameDetail, q.originalPrice, q.imageproduct, m.nameCategory, o.name as nameAgetype       FROM products p       INNER JOIN productsDetail q       ON p.id = q.productId INNER JOIN agetypes o       ON o.id = p.agetypesId INNER JOIN category m       ON m.id = p.categoryId; ",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAllProductWithPriceByAgetypesId: (id, callBack) => {
    pool.query(
      "SELECT p.id, p.name, p.categoryId, p.agetypesId, q.nameDetail, q.originalPrice, q.imageproduct, q.description       FROM products p       INNER JOIN productsDetail q       ON p.id = q.productId where p.agetypesId =? ; ",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateProduct: (data, callBack) => {
    pool.query(
      "update products set name =?,contentHTML =?,contentMarkdown=?,categoryId=?,agetypesId=?,view =?, madeby =?,material =?,brandId =? where id=?",
      [
        data.name,
        data.contentHTML,
        data.contentMarkdown,
        data.categoryId,
        data.agetypesId,
        data.view,
        data.madeby,
        data.material,
        data.brandId,
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
  deleteProduct: (data, callBack) => {
    pool.query(
      "delete from products where id=?",
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
