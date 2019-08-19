const routes = require('express').Router()
const {User} = require('./app/models')
const SessionController = require('./app/controllers/SessionController')


routes.get('/', (res,req)=>{
    console.log('get chegou')
    req.status(200).send()
})
routes.post('/sessions', SessionController.store)

module.exports = routes