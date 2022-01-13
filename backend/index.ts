import { parseCsv } from './csvParserToDb'
import sql from './db'
import { ALLOWED_METRICS, DATE_REGEX } from './constants'

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
  ctx.body = await sql`select id, farmname from farm`
})

router.get('/data', async (ctx: any) => {
  const params = ctx.request.query

  // param validation
  /* add farm validation later */
  const farmIds = await sql`select id::text from farm`
  const farmNotOk = params.farm && !farmIds.map((x: any) => x.id).includes(params.farm)
  const metricNotOk = params.metrictype && !ALLOWED_METRICS.includes(params.metrictype)
  const startdateNotOk = params.startdate && (!DATE_REGEX.test(params.startdate) || (params.enddate && new Date(params.startdate) > new Date(params.enddate)))
  const enddateNotOk = params.enddate && (!DATE_REGEX.test(params.enddate) || (params.startdate && new Date(params.startdate) > new Date(params.enddate)))
  if (metricNotOk || startdateNotOk || enddateNotOk) {
    ctx.status = 500
    ctx.body = 'wrong param(s):' + (farmNotOk ? ' farm' : '') + (metricNotOk ? ' metrictype' : '') + (startdateNotOk ? ' startdate' : '') + (enddateNotOk ? ' enddate' : '')
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
  const startdateNotOk = params.startdate && (!DATE_REGEX.test(params.startdate) || (params.enddate && new Date(params.startdate) > new Date(params.enddate)))
  const enddateNotOk = params.enddate && (!DATE_REGEX.test(params.enddate) || (params.startdate && new Date(params.startdate) > new Date(params.enddate)))
  if (startdateNotOk || enddateNotOk) {
    ctx.status = 500
    ctx.body = 'invalid param(s):' + (startdateNotOk ? ' startdate' : '') + (enddateNotOk ? ' enddate' : '')
    return
  }

  let queryBase = `
    select
      f.farmname, min(fd.metricvalue), max(fd.metricvalue), avg(fd.metricvalue), count(fd.metricvalue)
    from farmdata fd
    left join farm f on f.id = fd.farm_id
    where fd.metrictype = '${params.metrictype}'
  `

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
        farmname
      ) values (
        ${data.name}
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

app
  .use(Cors())
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8091)
