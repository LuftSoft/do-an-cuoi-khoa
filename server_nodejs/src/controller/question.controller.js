const express = require('express');
const questionService = require('../service/question.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await questionService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await questionService.getOne(id));
});

router.post('/', async (req, res) => {
    const subject = req.body;
    res.send(await questionService.create(subject));
});

router.put('/', async (req, res) => {
    const subject = req.body;
    res.send(await questionService.update(subject));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await questionService.delete(id));
});

module.exports = router;