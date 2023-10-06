const utils = require("../../utils");

const {
  create,
  getProductById,
  getProducts,
  getAllProductWithPrice,
  getAllProductWithPriceByAgetypesId,
  updateProduct,
  deleteProduct,
} = require("./product.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//npm install jsonwebtoken
const { sign } = require("jsonwebtoken");
module.exports = {
  createProduct: (req, res) => {
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
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getProductById: (req, res) => {
    const id = req.params.id;
    getProductById(id, (err, results) => {
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
        data: results,
      });
    });
  },

  getProducts: (req, res) => {
    getProducts((err, results) => {
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
  getAllProductWithPrice: (req, res) => {
    getAllProductWithPrice((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      // const data = {
      //   success: 1,
      //   data: results,
      // };
      return res.send(utils.createResult(err, results));
    });
  },

  getAllProductWithPriceByAgetypesId: (req, res) => {
    const id = req.params.id;
    getAllProductWithPriceByAgetypesId(id, (err, results) => {
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
      //
      return res.send(utils.createResult(err, results));
    });
  },

  updateProduct: (req, res) => {
    const body = req.body;
    //const salt = genSaltSync(10);
    //body.password = hashSync(body.password, salt);
    console.log(body);
    updateProduct(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Failed to update user",
        });
      }
      return res.json({
        success: 1,
        message: "Updated Successfully",
      });
    });
  },
  deleteProduct: (req, res) => {
    const user_id = req.params.id;
    deleteProduct(user_id, (err, results) => {
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
