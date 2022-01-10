import { parseCsv } from './csvParserToDb'
import sql from './db'
const Koa = require('koa')
const Router = require('@koa/router')
const Cors = require('@koa/cors')
const BodyParser = require('koa-body')

// call on startup
parseCsv()

const app = new Koa()
const router = new Router()

router.get('/', (ctx: any) => {
  ctx.body = 'Hello World'
})

router.get('/data', async (ctx: any) => {
  const params = ctx.request.query
  console.log(params)
  let queryBase = `
    select
      f.farmname,
      fd.datetimestamp,
      fd.metrictype,
      fd.metricvalue
    from farmdata fd
    left join farm f on f.id = fd.farm_id
  `

  if (Object.keys(params).length !== 0) {
    queryBase += ' where'
    if (params.farm) {
      queryBase += ` lower(f.farmname) like '${'%' + params.farm + '%'}'`
    }
    if (params.metrictype) {
      queryBase += params.farm ? ' and' : ''
      queryBase += ` fd.metrictype = '${params.metrictype}'`
    }
    if (params.startdate) {
      queryBase += params.farm || params.metrictype ? ' and' : ''
      queryBase += ` fd.datetimestamp >= '${params.startdate}'::date`
    }
    if (params.enddate) {
      queryBase += params.farm || params.metrictype || params.startdate ? ' and' : ''
      queryBase += ` fd.datetimestamp <= '${params.enddate}'::date`
    }
  }

  ctx.status = 200
  ctx.body = await sql.unsafe(queryBase + ' order by fd.datetimestamp')
})

app
  .use(Cors())
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8091)
