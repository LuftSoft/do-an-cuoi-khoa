const utils = require("../../utils");

const {
  create,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//npm install jsonwebtoken
const { sign } = require("jsonwebtoken");
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    //npm install bcrypt
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    create(body, (err, results) => {
      if (err) {
        // console.log(err);
        // res.status(500).json({
        //   success: 0,
        //   message: "Database connection error",
        // });
        return res.send(utils.createResult(true, results));
      }
      // return res.status(200).json({
      //   success: 1,
      //   data: results,
      // });
      return res.send(utils.createResult(err, results));
    });
  },
  getUserByUserId: (req, res) => {
    const user_id = req.params.user_id;
    getUserByUserId(user_id, (err, results) => {
      if (err) {
        console.log(err);
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

  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    console.log(body);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
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
  deleteUser: (req, res) => {
    const user_id = req.params.id;
    deleteUser(user_id, (err, results) => {
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
      return res.json({
        success: 1,
        message: "User deleted successfully",
      });
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
        // results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        // return res.json({
        //   success: 1,
        //   message: "login successfully",
        //   token: jsontoken,
        // });
        const data = {
          success: 1,
          data: results,
          token: jsontoken,
        };
        return res.send(utils.createResult(err, data));
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
