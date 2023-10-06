const {
  createProductsImages,
  getProductsImagesById,
  getProductsImages,
  updateProductsImages,
  deleteProductsImages,
} = require("./productImage.controller");
const db = require("../../configs/database");
const router = require("express").Router();
const utils = require("../../utils");

const { checktoken } = require("../../auth/token_validation");
// for uploading file(s)
//const multer = require("multer");
//const upload = multer({ dest: "uploads" });
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + ".jpg");
    //let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage });
//router.post("/", checktoken, createUser);
// router.post("/", upload.single('image'), createProductsImages);
// router.get("/", checktoken, getProductsImages);
// router.get("/:id", checktoken, getProductsImagesById);
// router.patch("/", checktoken, updateProductsImages);
// router.delete("/", checktoken, deleteProductsImages);
// router.post("/", upload.single("image"), (request, response) => {
//   const { caption, productDetailId, image } = request.body;

//   // request has a property named file which gives details of uploaded file
//   // console.log(request.file)
//   const filename = request.file.filename;
//   // image = filename;
//   db.query(
//     `insert into productImages(caption, productDetailId, image  ) values(?,?,?)`,
//     [caption, productDetailId, filename],
//     (error, result) => {
//       response.send(utils.createResult(error, result));
//     }
//   );
// });
router.post("/uploadfile", upload.single("image"), (request, response) => {
  const filename = request.file.filename;
  response.send(utils.createResult(false, filename));
  //response.send(utils.createResult(false, "Upload successfully"));
  //console.log(request);

  // try {
  //   const newFile = await File.create({
  //     name: req.file.filename,
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     message: "File created successfully!!",
  //   });
  // } catch (error) {
  //   res.json({
  //     error,
  //   });
  // }
});
router.post("/", createProductsImages);
router.get("/", getProductsImages);
router.get("/:id", getProductsImagesById);
router.patch("/", updateProductsImages);
router.delete("/", deleteProductsImages);

module.exports = router;
