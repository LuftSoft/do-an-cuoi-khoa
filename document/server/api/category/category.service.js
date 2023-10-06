const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into category(nameCategory ,agetypesId, description ) values(?,?,?)",
      [data.nameCategory, data.agetypesId, data.description],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getCategorys: (callBack) => {
    pool.query(
      "select id, nameCategory ,agetypesId, description from category",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getCategoryById: (id, callBack) => {
    pool.query(
      "select id, nameCategory ,agetypesId,description from category where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateCategory: (data, callBack) => {
    pool.query(
      "update category set nameCategory =?,agetypesId=?, description =? where id=?",
      [data.nameCategory, data.agetypesId, data.description, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteCategory: (data, callBack) => {
    pool.query(
      "delete from category where id=?",
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
