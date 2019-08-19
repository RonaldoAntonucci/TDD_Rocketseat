const request = require('supertest')
const { User } = require('../../src/app/models')
const app = require('../../src/app')
const truncate = require('../utils/truncate')

describe('Authentication', () => {
    beforeEach(async ()=>{
        await truncate()
    })

  it('should authenticate with valid credentials', async () => {
    let user = await User.create({
      name: 'Ronaldo',
      email: 'teste@email.com',
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
    let user = await User.create({
        name: 'Ronaldo',
        email: 'teste@email.com',
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
})
