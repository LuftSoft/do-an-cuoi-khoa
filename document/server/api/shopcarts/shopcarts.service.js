const e = require("express");
const pool = require("../../configs/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into shopCarts(userId,productId,quantity,statusId) values(?,?,?,?)",
      [data.userId, data.productId, data.quantity, data.statusId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getshopcarts: (callBack) => {
    pool.query(
      "SELECT p.id,q.id as productId, q.name, o.originalPrice ,p.quantity, o.imageproduct          FROM shopCarts p    INNER JOIN products q    ON p.productId = q.id  INNER JOIN productsDetail o   ON q.id = o.productId ",
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getshopcartById: (id, callBack) => {
    pool.query(
      "select userId,productId,quantity,statusId from shopCarts where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getshopcartByProductId: (id, callBack) => {
    pool.query(
      "select id, userId,productId,quantity,statusId from shopCarts where productId=?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getshopcartByuserId: (userId, callBack) => {
    pool.query(
      "select o.id, q.agetypesId, m.nameCategory, o.imageproduct, o.description, q.name,  o.nameDetail, o.originalPrice, p.productId, p.quantity  from shopCarts p inner join products q on p.productId = q.id inner join productsDetail o on q.id = o.productId   inner join category m on q.categoryId = m.id where p.userId =?",
      [userId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updatequantityshopcart: (data, callBack) => {
    pool.query(
      "update shopCarts set quantity =? where id=?",
      [data.quantity, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  updateshopcart: (data, callBack) => {
    pool.query(
      "update shopCarts set userId =?,productId =?,quantity =?,statusId =? where id=?",
      [data.userId, data.productId, data.quantity, data.statusId, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  },
  deleteshopcart: (data, callBack) => {
    pool.query(
      "delete from shopCarts where userId=?",
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
