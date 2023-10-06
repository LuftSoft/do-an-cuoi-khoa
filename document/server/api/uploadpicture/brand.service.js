const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
     
      "insert into brand( nameBrand ,    description ) values(?,?)",
      [
        data.nameBrand,
        data.description,
      
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getBrands: (callBack) => {
    pool.query(
      "select nameBrand ,    description  from brand",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getBrandById: (id, callBack) => {
    pool.query(
      "select nameBrand ,    description  from brand where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateBrand: (data, callBack) => {
    pool.query(
      "update brand set nameBrand =?,description =? where id=?",
      [
        data.nameBrand,
        data.description,
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
  deleteBrand: (id, callBack) => {
    pool.query(
      "delete from brand where id=?",
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
