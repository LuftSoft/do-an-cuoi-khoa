const express = require('express');
const userService = require('../service/user.service');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { authorize } = require('../extension/middleware/application.middleware');
const { logger, Helpers } = require('../extension/helper');
const router = express.Router();
const { CONFIG } = require('../shared/common.constants');

router.get('/', async (req, res) => {

});

router.get('/:id', async (req, res) => {

});

router.post('/', async (req, res) => {
    const question = req.body;
});

router.put('/', async (req, res) => {
    const question = req.body;
});

router.delete('/:id', async (req, res) => {

});
