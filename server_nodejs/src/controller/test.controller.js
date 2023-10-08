const express = require('express');
const testService = require('../service/test.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await testService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await testService.getOne(id));
});

router.post('/', async (req, res) => {
    const test = req.body;
    res.send(await testService.create(test));
});

router.put('/', async (req, res) => {
    const test = req.body;
    res.send(await testService.update(test));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await testService.delete(id));
});

module.exports = router;