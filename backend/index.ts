import { parseCsv } from './csvParserToDb'

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

app
  .use(Cors())
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8091)
