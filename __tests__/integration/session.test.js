const request = require('supertest')
//const { User } = require('../../src/app/models')
const app = require('../../src/app')
const truncate = require('../utils/truncate')

const factory = require('../factories')

describe('Authentication', () => {
    beforeEach(async ()=>{
        await truncate()
    })

  it('should authenticate with valid credentials', async () => {
    let user = await factory.create('User', {
      password: '123123'
    })

    let response = await request(app)
        .post("/sessions")
        .send({
            email: user.email,
            password: '123123'
        })

    expect(response.status).toBe(200)
  })

  it('should not authenticate with invalid credentials', async()=>{
    let user = await factory.create('User', {
      password: '123123'
    })
  
      let response = await request(app)
          .post("/sessions")
          .send({
              email: user.email,
              password: '3422342'
          })

    expect(response.status).toBe(401)
  })

  it('should not authenticate with invalid email', async()=>{
    let user = await factory.create('User', {
      password: '123123'
    })
  
      let response = await request(app)
          .post("/sessions")
          .send({
              email: 'invalidEmail',
              password: '123123'
          })

    expect(response.status).toBe(401)
  })

  it('should return jwt token when authenticated', async () => {
    let user = await factory.create('User', {
      password: '123123'
    })

    let response = await request(app)
        .post("/sessions")
        .send({
            email: user.email,
            password: '123123'
        })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to acess private routes when authenticated', async()=>{
    let user = await factory.create('User', {
      password: '123123'
    })

    let response = await request(app)
        .get("/dashboard")
        .set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to acess private routes without jwt token', async()=>{
    let user = await factory.create('User', {
      password: '123123'
    })

    let response = await request(app)
        .get("/dashboard")
        //.set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to acess private routes with invaldi jwt token',async()=>{
    let response = await request(app)
        .get("/dashboard")
        .set('Authorization', `Bearer 123123`)

    expect(response.status).toBe(401)
  })

})
