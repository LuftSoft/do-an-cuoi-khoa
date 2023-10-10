const express = require('express');
const resultService = require('../service/result.service');
const resultDetailService = require('../service/result_detail.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await resultService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await resultService.getOne(id));
});

router.post('/', async (req, res) => {
    const result = req.body;
    res.send(await resultService.create(result));
});

router.put('/', async (req, res) => {
    const result = req.body;
    res.send(await resultService.update(result));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await resultService.delete(id));
});

/* API giao đề thi cho từng nhóm */
router.get('/detail', async (req, res) => {
    res.send(await resultService.getAll());
});

router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await resultService.getOne(id));
});

router.post('/detail', async (req, res) => {
    const result = req.body;
    res.send(await resultService.create(result));
});

router.put('/detail', async (req, res) => {
    const result = req.body;
    res.send(await resultService.update(result));
});

router.delete('/detail/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await resultService.delete(id));
});

module.exports = router;