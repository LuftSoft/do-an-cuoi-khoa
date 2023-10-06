const utils = require("../../utils");
const {
  create,
  getorderProductDetailById,
  getorderProductDetail,
  getorderProductDetailByOrderId,
  getorderProductDetailByUserId,
  updateorderProductDetail,
  deleteorderProductDetail,
} = require("./ordersProductDetail.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//npm install jsonwebtoken
const { sign } = require("jsonwebtoken");
module.exports = {
  createorderProductDetail: (req, res) => {
    const body = req.body;
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
  getorderProductDetailById: (req, res) => {
    const id = req.params.id;
    getorderProductDetailById(id, (err, results) => {
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
  getorderProductDetailByOrderId: (req, res) => {
    const id = req.params.id;
    getorderProductDetailByOrderId(id, (err, results) => {
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
  getorderProductDetailByUserId: (req, res) => {
    const id = req.params.id;
    getorderProductDetailByUserId(id, (err, results) => {
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
  getorderProductDetail: (req, res) => {
    getorderProductDetail((err, results) => {
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
  updateorderProductDetail: (req, res) => {
    const body = req.body;
    //const salt = genSaltSync(10);
    //body.password = hashSync(body.password, salt);
    console.log(body);
    updateorderProductDetail(body, (err, results) => {
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
  deleteorderProductDetail: (req, res) => {
    const user_id = req.params.id;
    deleteorderProductDetail(user_id, (err, results) => {
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
