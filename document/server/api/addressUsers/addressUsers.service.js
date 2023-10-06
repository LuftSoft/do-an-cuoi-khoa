const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into addressUser(shipName , shipAddress , country, street1,  street2,  city, state, zipCode,  shipEmail ,  shipPhoneNumber, user_id ) values(?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.shipName,
        data.shipAddress,
        data.country,
        data.street1,
        data.street2,
        data.city,
        data.state,
        data.zipCode,
        data.shipEmail,
        data.shipPhoneNumber,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getaddressUser: (callBack) => {
    pool.query(
      "select id, shipName , shipAddress ,country, street1, street2,city, state,zipCode, shipEmail ,  shipPhoneNumber,  user_id from addressUser",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getaddressUserById: (id, callBack) => {
    pool.query(
      "select id, shipName , shipAddress ,country, street1, street2,city, state,zipCode, shipEmail ,  shipPhoneNumber,  user_id   from addressUser where user_id =?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateaddressUser: (data, callBack) => {
    pool.query(
      "update addressUser set shipName =?,shipAddress =?,country=?, street1=?,street2=?,city=?,state=?,zipCode=?,shipEmail=?,shipPhoneNumber=?, user_id=?  where id=?",
      [
        data.shipName,
        data.shipAddress,
        data.country,
        data.street1,
        data.street2,
        data.city,
        data.state,
        data.zipCode,
        data.shipEmail,
        data.shipPhoneNumber,
        data.user_id,
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
  deleteaddressUser: (data, callBack) => {
    pool.query(
      "delete from addressUser where id=?",
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
