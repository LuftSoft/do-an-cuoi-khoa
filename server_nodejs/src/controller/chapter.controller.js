const express = require('express');
const chapterService = require('../service/chapter.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await chapterService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await chapterService.getOne(id));
});

router.post('/', async (req, res) => {
    const subject = req.body;
    res.send(await chapterService.create(subject));
});

router.put('/', async (req, res) => {
    const subject = req.body;
    res.send(await chapterService.update(subject));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await chapterService.delete(id));
});

module.exports = router;