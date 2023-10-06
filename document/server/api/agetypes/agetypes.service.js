const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into agetypes(name ) values(?)",
      [data.name],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAgetypes: (callBack) => {
    pool.query(
      "select  id, name   from agetypes",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAgetypeById: (id, callBack) => {
    pool.query(
      "select  id, name  from agetypes where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateAgetype: (data, callBack) => {
    pool.query(
      "update agetypes set name =? where id=?",
      [data.name, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteAgetype: (data, callBack) => {
    pool.query(
      "delete from agetypes where id=?",
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
