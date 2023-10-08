const express = require('express');
const groupService = require('../service/group.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await groupService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await groupService.getOne(id));
});

router.post('/', async (req, res) => {
    const group = req.body;
    res.send(await groupService.create(group));
});

router.put('/', async (req, res) => {
    const group = req.body;
    res.send(await groupService.update(group));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await groupService.delete(id));
});

/**/
router.post('/user', async (req, res) => {
    const group = req.body;
    res.send(await groupService.createUserGroup(group));
});

router.put('/user', async (req, res) => {
    const group = req.body;
    res.send(await groupService.banUserGroup(group));
});

router.delete('/user', async (req, res) => {
    const group = req.body;
    res.send(await groupService.deleteUserGroup(group));
});

module.exports = router;