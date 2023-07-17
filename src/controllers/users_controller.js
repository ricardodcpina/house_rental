const express = require('express')
const router = express.Router()

const userService = require('../services/user_service')
const { authentication } = require('../middlewares')

router.get('/salt', async (req, res) => {
    const SALT = await userService.generateSALT()

    res.status(200).json({ SALT: SALT })
})

router.post('/auth', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await userService.authUser(username, password)

        res.status(200).json(user)
    } catch (err) {
        res.status(401).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    const { username, email, password } = req.body

    try {
        const user = await userService.createUser(username, email, password)

        res.status(201).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get('/', authentication, async (req, res) => {
    const users = await userService.listUsers()

    res.status(200).json(users)
})

router.get('/:id', authentication, async (req, res) => {
    const { id } = req.params

    try {
        const user = await userService.findUser(id)

        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/:id', authentication, async (req, res) => {
    const { id } = req.params
    const input = req.body

    try {
        const data = await userService.updateUser(id, input)

        res.status(200).json(data)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:id', authentication, async (req, res) => {
    const { id } = req.params

    try {
        const user = await userService.softDeleteUser(id)

        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router