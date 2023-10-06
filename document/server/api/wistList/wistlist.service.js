const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into wishList(userId,productId) values(?,?)",
      [data.userId, data.productId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getwishList: (userid, callBack) => {
    pool.query(
      "SELECT p.id,q.id as productId, q.name, o.originalPrice , o.imageproduct, o.description          FROM wishList p    INNER JOIN products q    ON p.productId = q.id  INNER JOIN productsDetail o   ON q.id = o.productId  where userId=?",
      [userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getwishListById: (id, callBack) => {
    pool.query(
      "select userId,productId from wishList where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getwishListByProductId: (id, callBack) => {
    pool.query(
      "select id, userId,productId from wishList where productId=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updatewishList: (data, callBack) => {
    pool.query(
      "update wishList set userId =?,productId =? where id=?",
      [data.userId, data.productId, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deletewishList: (data, callBack) => {
    pool.query(
      "delete from wishList where id=?",
      [data],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
