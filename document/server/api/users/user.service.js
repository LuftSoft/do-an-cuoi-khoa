const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into users(firstname,lastname,email,password,phonenumber,uname) values(?,?,?,?,?,?)",
      [
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.phonenumber,
        data.uname,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      "select id, firstname,lastname,email,phonenumber,uname from users",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      "select * from users where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByEmail: (email, callBack) => {
    pool.query(
      "select * from users where email=?",
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      "update users set firstname =?,lastname =?,email=?,password=? ,phonenumber=?,uname =? where id=?",
      [
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.phonenumber,
        data.uname,
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
  deleteUser: (data, callBack) => {
    pool.query(
      "delete from users where id=?",
      [user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
