const utils = require("../../utils");
const {
  create,
  getshopcartById,
  getshopcartByProductId,
  getshopcartByuserId,
  getshopcarts,
  updatequantityshopcart,
  updateshopcart,
  deleteshopcart,
} = require("./shopcarts.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//npm install jsonwebtoken
const { sign } = require("jsonwebtoken");
module.exports = {
  createshopcart: (req, res) => {
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
      return res.send(utils.createResult(err, results));
      // return res.status(200).json({
      //   success: 1,
      //   data: results,
      // });
    });
  },
  getshopcartById: (req, res) => {
    const id = req.params.id;
    getshopcartById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getshopcartByProductId: (req, res) => {
    const id = req.params.id;
    getshopcartByProductId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Record not found",
        // });
        data = null;
        return res.send(utils.createResult(true, data));
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getshopcartByuserId: (req, res) => {
    const userId = req.params.userId;
    getshopcartByuserId(userId, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        data = null;
        return res.send(utils.createResult(true, data));
      }

      return res.send(utils.createResult(err, results));
    });
  },
  getshopcarts: (req, res) => {
    getshopcarts((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      // return res.json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  updatequantityshopcart: (req, res) => {
    const body = req.body;
    //const salt = genSaltSync(10);
    //body.password = hashSync(body.password, salt);
    console.log(body);
    updatequantityshopcart(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Failed to update receiptdetails",
        });
      }
      return res.json({
        success: 1,
        message: "Updated Successfully",
      });
    });
  },
  updateshopcart: (req, res) => {
    const body = req.body;
    //const salt = genSaltSync(10);
    //body.password = hashSync(body.password, salt);
    console.log(body);
    updateshopcart(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Failed to update receiptdetails",
        });
      }
      return res.json({
        success: 1,
        message: "Updated Successfully",
      });
    });
  },
  deleteshopcart: (req, res) => {
    const id = req.params.id;
    deleteshopcart(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        // return res.json({
        //   success: 0,
        //   message: "Record not found",
        // });
        data = null;
        return res.send(utils.createResult(true, data));
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
