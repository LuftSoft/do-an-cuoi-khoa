const userRepository = require("../repository/user.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const authService = require("./common/auth.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const sendMailService = require("./common/sendmail.service");
const { Helpers, logger } = require("../extension/helper");

module.exports = {
  create: async (user) => {
    user.passwordHash = authService.hashPassword(user.password);
    user.code = user.email?.split("@")[0].toUpperCase();
    return await userRepository.create(user);
  },
  login: async (userLogin) => {
    const { email, password } = userLogin;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    const isPasswordCorrect = authService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    user.roles = await userRepository.getRoles(user.id);
    if (user.roles) {
      let permissions = [];
      for (let r of user.roles) {
        permissions.push(await userRepository.getPemissions(r.id));
      }
      user.permissions = permissions;
    }
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  logOut: (req, res, next) => {
    const { _id } = req.data;
    new User()
      .logOut()
      .then((data) => {
        console.log(data);
        return res
          .status(201)
          .json({ message: "logout success", isSuccess: true });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .json({ message: "logout success", isSuccess: false, err });
      });
  },
  getAll: async () => {
    var users = await userRepository.getAll();
    users.forEach((user) => {
      user.avatar = user.avatar ? user.avatar.toString("base64") : user.avatar;
    });
    return users;
  },
  getAllByType: async (type) => {
    try {
      const users = await userRepository.getByType(type);
      users.forEach((user) => {
        user.avatar = user.avatar
          ? user.avatar.toString("base64")
          : user.avatar;
      });
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        users,
        "Get user list success"
      );
    } catch (err) {
      logger.error(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "Failed when get users"
      );
    }
  },
  getById: async (id) => {
    const user = await userRepository.getById(id);
    user.roles = await userRepository.getRoles(user.id);
    if (user.roles) {
      let permissions = [];
      for (let r of user.roles) {
        permissions.push(await userRepository.getPemissions(r.id));
      }
      user.permissions = permissions;
    }
    return user;
  },
  update: async (userUpdate) => {
    const { email, password } = userUpdate;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    const isPasswordCorrect = authService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    await userRepository.update(user);
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  changePasswordController: async (userPassword, token) => {
    try {
      const { oldPassword, newPassword } = userPassword;
      const id = authService.getUserIdFromJWTToken(
        token,
        process.env.SECRET_TOKEN_KEY
      );
      if (!id) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.TOKEN_INVALID);
      }
      const user = await userRepository.getById(id);
      if (!user) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
      }
      const isPasswordCorrect = authService.comparePassword(
        oldPassword,
        user.passwordHash
      );
      if (!isPasswordCorrect) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
      }
      const newPasswordHash = authService.hashPassword(newPassword);
      user.passwordHash = newPasswordHash;
      await userRepository.update(user);
      return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, user, "");
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  forgotPassword: async (user) => {
    const { email } = user;
    const userExists = await userRepository.getByEmail(email);
    if (!userExists) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.FORGOT_PASSWORD);
    }
    const resetPasswordToken = userExists.resetPasswordToken;
    if (resetPasswordToken) {
      console.log(resetPasswordToken);
      if (
        authService.verifyToken(
          resetPasswordToken,
          process.env.RESET_PASSWORD_TOKEN_KEY
        )
      ) {
        logger.error("resetPasswordToken still expiredin");
        return false;
      }
    }
    const newResetPasswordToken = authService.generateResetPasswordToken(
      userExists.id
    );
    const result = await sendMailService.SendMailHTML(
      userExists.email,
      CONFIG.API_MESSAGE.USER.FORGOT_PASSWORD,
      `${newResetPasswordToken}`
    );
    if (result) userExists.resetPasswordToken = newResetPasswordToken;
    await userRepository.update(userExists);
    return result ? newResetPasswordToken : false;
  },
  confirmPassword: async (token, newPassword) => {
    if (!authService.verifyToken(token, process.env.RESET_PASSWORD_TOKEN_KEY)) {
      logger.error("token is expired");
      throw new Error("token is expired");
    }
    const userId = authService.getUserIdFromJWTToken(
      token,
      process.env.RESET_PASSWORD_TOKEN_KEY
    );
    if (!userId) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.CONFIRM_PASSWORD);
    }
    const user = await userRepository.getById(userId);
    if (!user || user.resetPasswordToken !== token) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.CONFIRM_PASSWORD);
    }
    const newPasswordHash = authService.hashPassword(newPassword);
    user.passwordHash = newPasswordHash;
    const userUpdate = await userRepository.update(user);
    return userUpdate ? userUpdate : false;
  },
  getUser: (req, res, next) => {
    const { _id } = req.data;
    new User()
      .getUser()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  editProfile: (req, res, next) => {
    const { _id } = req.data;
    const { name, email, phone } = req.body;
    const file = req.file;
    new User()
      .putUser()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  updateAvatar: async (avatar, token) => {
    try {
      const userId = authService.getUserIdFromJWTToken(
        token,
        process.env.SECRET_TOKEN_KEY
      );
      if (!userId) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.TOKEN_INVALID);
      }
      const user = await userRepository.getById(userId);
      if (!user) {
        throw new Error("User is not exist");
      }
      user.avatar = avatar ? avatar.buffer : null;
      const userUpdate = await userRepository.update(user);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        userUpdate,
        "Thay đổi ảnh đại diện thành công"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateInformation: async (userInfo, avatar, token) => {
    try {
      const user = await userRepository.getById(userInfo?.id);
      if (!user) {
        throw new Error("User is not exist");
      }
      if (avatar) {
        user.avatar = avatar.buffer;
      }
      const userUpdate = await userRepository.update(user);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        userUpdate,
        "Cập nhật thông tin cá nhân thành công"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  isAdmin: async (id) => {
    const user = await getById(id);
    if (!user) {
      return false;
    }
    const role = user.roles[0]?.name;
    if (role === CONFIG.ROLE.ADMIN) {
      return true;
    }
    return false;
  },
};
