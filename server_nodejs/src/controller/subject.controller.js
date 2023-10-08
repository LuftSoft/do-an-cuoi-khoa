const express = require('express');
const subjectService = require('../service/subject.service');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { authorize } = require('../extension/middleware/application.middleware');
const { logger, Helpers } = require('../extension/helper');
const router = express.Router();
const { CONFIG } = require('../shared/common.constants');

router.get('/', async (req, res) => {
    res.send(await subjectService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await subjectService.getOne(id));
});

router.post('/', async (req, res) => {
    const subject = req.body;
    res.send(await subjectService.create(subject));
});

router.put('/', async (req, res) => {
    const subject = req.body;
    res.send(await subjectService.update(subject));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await subjectService.delete(id));
});

module.exports = router;