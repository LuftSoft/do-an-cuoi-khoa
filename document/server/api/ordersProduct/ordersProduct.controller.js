const utils = require("../../utils");

const {
  create,
  getorderProductsById,
  getorderProducts,
  getorderProductsByUserId,
  updateorderProduct,
  deleteorderProduct,
} = require("./ordersProduct.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//npm install jsonwebtoken
const { sign } = require("jsonwebtoken");
module.exports = {
  createorderProducts: (req, res) => {
    const body = req.body;
    //body.codeOrder = uid(32); //=> 'dcbc3e65506a7e6f15d30a357e884432'
    //npm install bcrypt
    //const salt = genSaltSync(10);
    // body.password = hashSync(body.password, salt);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      // return res.status(200).json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getorderProductsById: (req, res) => {
    const id = req.params.id;
    getorderProductsById(id, (err, results) => {
      if (err) {
        // console.log(err);
        // return;
        return res.send(utils.createResult(err, results));
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Record not found",
        // });
        return res.send(utils.createResult(true, results));
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getorderProductsByUserId: (req, res) => {
    const userId = req.params.userid;
    getorderProductsByUserId(userId, (err, results) => {
      if (err) {
        // console.log(err);
        // return;
        return res.send(utils.createResult(err, results));
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Record not found",
        // });
        return res.send(utils.createResult(true, results));
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getorderProducts: (req, res) => {
    getorderProducts((err, results) => {
      if (err) {
        // console.log(err);
        // return;
        return res.send(utils.createResult(err, results));
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  updateorderProduct: (req, res) => {
    const body = req.body;
    //const salt = genSaltSync(10);
    //body.password = hashSync(body.password, salt);
    console.log(body);
    updateorderProduct(body, (err, results) => {
      if (err) {
        // console.log(err);
        // return;
        return res.send(utils.createResult(err, results));
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Failed to update user",
        // });
        return res.send(utils.createResult(true, results));
      }
      // return res.json({
      //   success: 1,
      //   message: "Updated Successfully",
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  deleteorderProduct: (req, res) => {
    const user_id = req.params.id;
    deleteorderProduct(user_id, (err, results) => {
      if (err) {
        // console.log(err);
        // return;
        return res.send(utils.createResult(err, results));
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Record not found",
        // });
        return res.send(utils.createResult(err, results));
      }
      // return res.json({
      //   success: 1,
      //   message: "User deleted successfully",
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  login: (req, res) => {
    const body = req.body;
    console.log(body);
    getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      console.log(results);
      //   return res.json({
      //     success: 1,
      //     data: results,
      //   });
      const result = compareSync(body.password, results.password);
      console.log("sdasdasd:" + result);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
