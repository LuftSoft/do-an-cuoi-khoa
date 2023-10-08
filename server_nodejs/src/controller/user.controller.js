const express = require('express');
const userService = require('../service/user.service');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { authorize } = require('../extension/middleware/application.middleware');
const { logger, Helpers } = require('../extension/helper');
const router = express.Router();
const { CONFIG } = require('../shared/common.constants');
const { uploadUtil } = require('../util/upload.util');

router.post('/signup', async (req, res) => {
    const user = req.body;
    try {
        const response = await userService.create(user);
        res.send(new BaseAPIResponse(res.statusCode, response, ''));
    }
    catch (err) {
        logger.error(`Singup failed - Email: "${user.email}" - Error: ${err.message || err.message}`);
        res.send(new BaseAPIResponse(res.statusCode, null, err.message || CONFIG.ERROR.VALIDATION_ERROR));
    }
});

router.post('/login', async (req, res) => {
    const user = req.body;
    try {
        const response = await userService.login(user);
        res.send(new BaseAPIResponse(res.statusCode, response, ''));
    }
    catch (err) {
        logger.error(`Login failed - Email: "${user.email}" - Error: ${err?.message}`);
        res.send(new BaseAPIResponse(res.statusCode, null, err?.message || CONFIG.ERROR.VALIDATION_ERROR));
    }
});

router.post('/forgot-password', async (req, res) => {
    const user = req.body;
    try {
        let status = CONFIG.RESPONSE_STATUS_CODE.SUCCESS;
        const response = await userService.forgotPassword(user);
        if (!response) status = CONFIG.RESPONSE_STATUS_CODE.ERROR;
        res.send(new BaseAPIResponse(status, response, ''));
    }
    catch (err) {
        logger.error(`Login failed - Email: "${user.email}" - Error: ${err?.message}`);
        res.send(new BaseAPIResponse(res.statusCode, null, err?.message || CONFIG.ERROR.VALIDATION_ERROR));
    }
});

router.put('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const response = await userService.confirmPassword(token, newPassword);
        res.send(new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, ''));
    }
    catch (err) {
        console.error(err);
        logger.error(`confirm passs failed - Error: ${err?.message}`);
        res.send(new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err?.message || CONFIG.ERROR.VALIDATION_ERROR));
    }
});

router.post('/refresh-token', async (req, res) => {
    const user = req.body;
});
router.get('/', authorize([]), async (req, res) => {
    res.send(await userService.getAll());
});
router.get('/:id', authorize([]), async (req, res) => {
    const user = await userService.getById(req.params.id);
    let msg = '';
    if (!user) {
        msg = 'user not found';
        logger.error(msg);
    }
    res.send(new BaseAPIResponse(res.statusCode, user, msg));
});
router.put('/avatar', uploadUtil.upload.single('avatar'), async (req, res) => {
    const token = Helpers.getAuthToken(req);
    const avatar = req.file;
    res.send(await userService.updateAvatar(avatar, token));
});
router.put('/password', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const userPassword = req.body;
    const result = await userService.changePasswordController(userPassword, token);
    res.send(result);
});
router.delete('', async (req, res) => {
    const user = req.body;
});
module.exports = router;