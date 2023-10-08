const express = require('express');
const creditClassService = require('../service/credit_class.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await creditClassService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await creditClassService.getOne(id));
});

router.post('/', async (req, res) => {
    const creditClass = req.body;
    res.send(await creditClassService.create(creditClass));
});

router.put('/', async (req, res) => {
    const creditClass = req.body;
    res.send(await creditClassService.update(creditClass));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await creditClassService.delete(id));
});

module.exports = router;