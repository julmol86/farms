const jestG = require('@jest/globals')
const request = require('supertest')
const app = require('./index')

// Note: start and stop backend to make sure csv is parsed and ONLY default data is present in DB
// After that run tests with the following command:
//   npm run tests
jestG.describe('index.ts tests', () => {
  const agent = request.agent(app)
  let farmId

  jestG.it('farms: default number of farms', async () => {
    const res = await agent.get('/farms')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toEqual(4)
  })

  jestG.it('data: all', async () => {
    const res = await agent.get('/data?farm=&metrictype=&month=&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('data: farm', async () => {
    const res = await agent.get('/data?farm=1&metrictype=&month=&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('data: farm and metric', async () => {
    const res = await agent.get('/data?farm=1&metrictype=ph&month=&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('data: metric and month', async () => {
    const res = await agent.get('/data?farm=&metrictype=rainfall&month=10&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('data: farm and date range', async () => {
    const res = await agent.get('/data?farm=2&metrictype=&month=&startdate=2020-01-01&enddate=2020-01-05')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('aggregate: metrictype only', async () => {
    const res = await agent.get('/aggregate?metrictype=temperature&month=&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toEqual(4)
  })

  jestG.it('aggregate: metrictype and month', async () => {
    const res = await agent.get('/aggregate?metrictype=rainfall&month=3&startdate=&enddate=')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toEqual(4)
  })

  jestG.it('aggregate: metrictype and date range', async () => {
    const res = await agent.get('/aggregate?metrictype=ph&month=&startdate=2019-01-01&enddate=2019-02-01')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toEqual(4)
  })

  jestG.it('aggregate: invalid metrictype', async () => {
    const res = await agent.get('/aggregate?metrictype=zzz&month=&startdate=&enddate=')
    jestG.expect(res.status).toEqual(500)
    jestG.expect(res.res.text).toEqual('metrictype param is missing or invalid')
  })

  jestG.it('aggregate: startdate after enddate', async () => {
    const res = await agent.get('/aggregate?metrictype=temperature&month=&startdate=2019-03-01&enddate=2019-02-01')
    jestG.expect(res.status).toEqual(500)
    jestG.expect(res.res.text).toEqual('invalid param(s): startdate enddate')
  })

  jestG.it('create new farm: missing data', async () => {
    const data = {
      name: undefined,
      longitude: 27.02843,
      latitude: 69.90864,
      login: 'utsjoki',
      password: 'utsjoki'
    }
    const res = await agent.post('/createfarm').send(data)
    jestG.expect(res.status).toEqual(500)
    jestG.expect(res.res.text).toEqual('not good')
  })

  jestG.it('create new farm: success', async () => {
    const data = {
      name: 'Utsjoki Blossom farm',
      longitude: 27.02843,
      latitude: 69.90864,
      login: 'utsjoki',
      password: 'utsjoki'
    }
    const res = await agent.post('/createfarm').send(data)
    jestG.expect(res.res.text).toEqual('all good!')

    const res2 = await agent.get('/farms')
    farmId = res2.body[4].id
    jestG.expect(res2.status).toEqual(200)
    jestG.expect(res2.body.length).toEqual(5)
  })

  jestG.it('sign in: invalid username', async () => {
    const data = {
      login: 'someone',
      password: 'utsjoki'
    }
    const res = await agent.post('/signin').send(data)
    jestG.expect(res.status).toEqual(204)
    jestG.expect(res.res.text).toEqual('')
  })

  jestG.it('sign in: invalid password', async () => {
    const data = {
      login: 'utsjoki',
      password: 'wrong!'
    }
    const res = await agent.post('/signin').send(data)
    jestG.expect(res.status).toEqual(200)
    jestG.expect(JSON.parse(res.res.text).loggedIn).toEqual(false)
  })

  jestG.it('sign in: success', async () => {
    const data = {
      login: 'utsjoki',
      password: 'utsjoki'
    }
    const res = await agent.post('/signin').send(data)
    jestG.expect(res.status).toEqual(200)
    jestG.expect(JSON.parse(res.res.text).loggedIn).toEqual(true)
  })

  jestG.it('get farmdata: new farm, empty array', async () => {
    const res = await agent.get(`/farm/${farmId}/farmdata`)
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toEqual(0)
  })

  jestG.it('get farmdata: existing farm, lots of data', async () => {
    const res = await agent.get('/farm/1/farmdata')
    jestG.expect(res.status).toEqual(200)
    jestG.expect(res.body.length).toBeGreaterThan(0)
  })

  jestG.it('insert farmdata', async () => {
    const data = {
      farm: farmId,
      metrictype: 'ph',
      metricvalue: '5.5'
    }
    const res = await agent.post('/insertfarmdata').send(data)
    jestG.expect(res.status).toEqual(200)

    const res2 = await agent.get(`/farm/${farmId}/farmdata`)
    jestG.expect(res2.status).toEqual(200)
    jestG.expect(res2.body.length).toEqual(1)
  })
})
