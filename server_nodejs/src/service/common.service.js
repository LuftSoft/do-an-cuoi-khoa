const credit_classRepository = require("../repository/credit_class.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const commonRepository = require("../repository/common.repository");
const authService = require("./common/auth.service");
const userRepository = require("../repository/user.repository");
module.exports = {
  getFourTopInfo: async () => {
    try {
      var data = await commonRepository.getFourTopInfo();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getPieChartMark: async () => {
    try {
      var data = await commonRepository.getPieChartMark();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getBarChartSemester: async () => {
    try {
      var data = await commonRepository.getBarChartSemester();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  CHECK_USER_TOKEN: (accessToken, res) => {
    try {
      const userId = authService.getUserIdFromJWTToken(
        accessToken,
        process.env.SECRET_TOKEN_KEY
      );
      if (!userId) {
        res.send(
          new BaseAPIResponse(
            "NOT AUTHORIZE",
            null,
            "Không có quyền truy cập tài nguyên"
          )
        );
        return false;
      } else {
        return userId;
      }
    } catch (e) {
      res.send(
        new BaseAPIResponse(
          "NOT AUTHORIZE",
          null,
          "Không có quyền truy cập tài nguyên"
        )
      );
      return false;
    }
  },
  getRoles: async () => {
    try {
      const roles = await commonRepository.getRoles();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        roles,
        "get role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getPermissonByRole: async (id) => {
    try {
      const roles = await commonRepository.getPermissonByRole(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        roles,
        "get permission by success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getUserByRole: async (id) => {
    try {
      const data = await commonRepository.getUserByRole(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        "get user by role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  deleteUserRoles: async (id) => {
    try {
      const res = await commonRepository.deleteUserRoles(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        res,
        "delete role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  deleteRolePermissions: async (id) => {
    try {
      const res = await commonRepository.deleteRolePermissions(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        res,
        "delete role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  putRole: async (data) => {
    try {
      const role = await commonRepository.getRole(data.id);
      role.dataValues = { ...data };
      const res = await commonRepository.putPermission(role);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        res,
        "update role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  putPermission: async (data) => {
    try {
      const permission = await commonRepository.getPermission(data.id);
      permission.dataValues = { ...data };
      const res = await commonRepository.putPermission(permission);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        res,
        "update role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  addUserToRole: async (data) => {
    try {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        await commonRepository.addUserToRole(data),
        "update role success"
      );
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
