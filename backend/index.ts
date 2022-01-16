import { parseCsv } from './csvParserToDb'
import sql from './db'
import { ALLOWED_METRICS, ALLOWED_MONTHS, DATE_REGEX } from './constants'

const Koa = require('koa')
const Router = require('@koa/router')
const Cors = require('@koa/cors')
const BodyParser = require('koa-body')
const bcrypt = require('bcrypt')

// call on startup
parseCsv()

const app = new Koa()
const router = new Router()

router.get('/farms', async (ctx: any) => {
  ctx.status = 200
  ctx.body = await sql`select id, farmname, longitude, latitude from farm`
})

router.get('/data', async (ctx: any) => {
  const params = ctx.request.query

  // param validation
  const farmIds = await sql`select id::text from farm`
  const farmNotOk = params.farm && !farmIds.map((x: any) => x.id).includes(params.farm)
  const metricNotOk = params.metrictype && !ALLOWED_METRICS.includes(params.metrictype)
  const monthNotOk = params.month && !ALLOWED_MONTHS.includes(params.month)
  const startdateNotOk = params.startdate && (!DATE_REGEX.test(params.startdate) || (params.enddate && new Date(params.startdate) > new Date(params.enddate)))
  const enddateNotOk = params.enddate && (!DATE_REGEX.test(params.enddate) || (params.startdate && new Date(params.startdate) > new Date(params.enddate)))
  if (farmNotOk || metricNotOk || monthNotOk || startdateNotOk || enddateNotOk) {
    ctx.status = 500
    ctx.body = 'wrong param(s):' + (farmNotOk ? ' farm' : '') + (metricNotOk ? ' metrictype' : '') + (monthNotOk ? ' month' : '') + (startdateNotOk ? ' startdate' : '') + (enddateNotOk ? ' enddate' : '')
  } else {
    let queryBase = `
      select
        f.farmname,
        fd.datetimestamp,
        fd.metrictype,
        fd.metricvalue
      from farmdata fd
      left join farm f on f.id = fd.farm_id
    `
    // filter if necessary
    if (Object.keys(params).length !== 0) {
      if (params.farm) {
        queryBase += ` where f.id = '${params.farm}'`
      }
      if (params.metrictype) {
        queryBase += params.farm ? ' and' : ' where'
        queryBase += ` fd.metrictype = '${params.metrictype}'`
      }
      if (params.month) {
        queryBase += params.farm || params.metrictype ? ' and' : ' where'
        queryBase += ` EXTRACT(MONTH FROM fd.datetimestamp)::int = ${params.month}`
      }
      if (params.startdate) {
        queryBase += params.farm || params.metrictype ? ' and' : ' where'
        queryBase += ` fd.datetimestamp >= '${params.startdate}'::date`
      }
      if (params.enddate) {
        queryBase += params.farm || params.metrictype || params.startdate ? ' and' : ' where'
        queryBase += ` fd.datetimestamp <= '${params.enddate}'::date`
      }
    }

    ctx.status = 200
    ctx.body = await sql.unsafe(queryBase + ' order by fd.datetimestamp')
  }
})

router.get('/aggregate', async (ctx: any) => {
  const params = ctx.request.query

  // metric type is a required paramater
  if (!params.metrictype || !ALLOWED_METRICS.includes(params.metrictype)) {
    ctx.status = 500
    ctx.body = 'metrictype param is missing or invalid'
    return
  }

  // param validation
  const monthNotOk = params.month && !ALLOWED_MONTHS.includes(params.month)
  const startdateNotOk = params.startdate && (!DATE_REGEX.test(params.startdate) || (params.enddate && new Date(params.startdate) > new Date(params.enddate)))
  const enddateNotOk = params.enddate && (!DATE_REGEX.test(params.enddate) || (params.startdate && new Date(params.startdate) > new Date(params.enddate)))
  if (monthNotOk || startdateNotOk || enddateNotOk) {
    ctx.status = 500
    ctx.body = 'invalid param(s):' + (monthNotOk ? ' month' : '') + (startdateNotOk ? ' startdate' : '') + (enddateNotOk ? ' enddate' : '')
    return
  }

  let queryBase = `
    select
      f.farmname, min(fd.metricvalue), max(fd.metricvalue), avg(fd.metricvalue), count(fd.metricvalue)
    from farmdata fd
    left join farm f on f.id = fd.farm_id
    where fd.metrictype = '${params.metrictype}'
  `
  if (params.month) {
    queryBase += params.farm || params.metrictype ? ' and' : ' where'
    queryBase += ` EXTRACT(MONTH FROM fd.datetimestamp)::int = ${params.month}`
  }
  if (params.startdate) {
    queryBase += ` and fd.datetimestamp >= '${params.startdate}'::date`
  }
  if (params.enddate) {
    queryBase += ` and fd.datetimestamp <= '${params.enddate}'::date`
  }

  ctx.status = 200
  ctx.body = await sql.unsafe(queryBase + ' group by f.id order by f.farmname')
})

router.post('/createfarm', async (ctx: any) => {
  const data = ctx.request.body

  try {
    // create farm
    const [farm] = await sql`
      insert into farm (
        farmname,
        longitude,
        latitude
      ) values (
        ${data.name},
        ${data.longitude},
        ${data.latitude}
      ) returning id
    `

    // hash password for new user
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const passwordHash = await bcrypt.hash(data.password, salt)

    // create user for that created farm
    await sql`
      insert into farmuser (
        farm_id,
        login,
        password
      ) values (
        ${farm.id},
        ${data.login},
        ${passwordHash}
      ) returning login, password
    `
    console.log(`Username '${data.login}' with password '${data.password}' successfully created for farm '${data.name}'.`)

    ctx.status = 200
    ctx.body = 'all good!'
  } catch (e) {
    console.log(e)
    ctx.status = 500
    ctx.body = 'not good'
  }
})

router.post('/signin', async (ctx: any) => {
  const data = ctx.request.body
  const [user] = await sql`select * from farmuser where login = ${data.login}`

  if (!user) {
    ctx.status = 204 // 204 No Content
    ctx.body = { loggedIn: false, login: undefined, farmId: undefined }
  } else {
    const res = await bcrypt.compare(data.password, user.password)

    ctx.status = 200
    ctx.body = { loggedIn: res, login: user.login, farmId: user.farm_id }
  }
})

router.get('/farm/:farmId/farmdata', async (ctx: any) => {
  ctx.status = 200
  ctx.body = await sql`
    select
      fd.datetimestamp,
      fd.metrictype,
      fd.metricvalue
    from farmdata fd
    left join farm f on f.id = fd.farm_id
    where f.id = ${ctx.params.farmId}
    order by fd.datetimestamp desc
  `
})

router.post('/insertfarmdata', async (ctx: any) => {
  const data = ctx.request.body
  ctx.status = 200
  ctx.body = await sql`
    insert into farmdata (
      farm_id,
      metrictype,
      metricvalue
    ) values (
      ${data.farm},
      ${data.metrictype},
      ${data.metricvalue}
    ) returning datetimestamp, metrictype, metricvalue
  `
})

app
  .use(Cors())
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app.listen(8091)
