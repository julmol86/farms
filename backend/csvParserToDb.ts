import { parseFile } from 'fast-csv'
import sql from './db'
import { ALLOWED_METRICS, CSV_FOLDER } from './constants'
import { coordinates } from './coord'

const fs = require('fs')
const bcrypt = require('bcrypt')

const validateRow = (row: string[]): boolean => {
  const metricType = row[2]?.toLowerCase()
  if (ALLOWED_METRICS.includes(metricType)) {
    const metricValue = row[3] ? parseFloat(row[3]) : undefined
    const phOk = metricValue != null && metricType === 'ph' && metricValue >= 0 && metricValue <= 14
    const temperatureOk = metricValue != null && metricType === 'temperature' && metricValue >= -50 && metricValue <= 100
    const rainfallOk = metricValue != null && metricType === 'rainfall' && metricValue >= 0 && metricValue <= 500
    return phOk || temperatureOk || rainfallOk
  }
  return false
}

const convertRowToObj = (row: string[]) => ({
  farmname: row[0],
  datetimestamp: row[1] ? new Date(row[1]) : undefined,
  metrictype: row[2]?.toLowerCase(),
  metricvalue: row[3] ? parseFloat(row[3]) : undefined
})

export const parseCsv = () => {
  fs.readdir(CSV_FOLDER, (_err: any, filenames: any) => {
    filenames.forEach(async (filename: any) => {
      // check if file has been already parsed before
      const [stamp] = await sql`select createstamp from filesuploaded where filename = ${filename}`

      // proceed if content does not exist in DB yet
      if (stamp) {
        console.log(`File ${filename} has been parsed on ${stamp.createstamp}, skipping...`)
      } else {
        let validData: any = []
        parseFile(CSV_FOLDER + '/' + filename)
          .on('error', error => console.error(error))
          .on('data', row => {
            if (validateRow(row)) {
              validData.push(convertRowToObj(row))
            }
          })
          .on('end', async (rowCount: number) => {
            // insert farm
            const coordId = Math.floor(Math.random() * coordinates.length)
            const [farm] = await sql`
              insert into farm (
                farmname,
                longitude,
                latitude
              ) values (
                ${validData[0].farmname},
                ${coordinates[coordId].longitude},
                ${coordinates[coordId].latitude}
              ) returning id
            `

            // hash password and insert user
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const passwordPlain = 'password_' + farm.id
            const passwordHash = await bcrypt.hash(passwordPlain, salt)

            const [user] = await sql`
              insert into farmuser (
                farm_id,
                login,
                password
              ) values (
                ${farm.id},
                ${'user_' + farm.id},
                ${passwordHash}
              ) returning login, password
            `
            console.log(`Username '${user.login}' with password '${passwordPlain}' successfully created for farm '${validData[0].farmname}'.`)

            // add farmId param to every object
            validData = validData.map((x: any) => ({ ...x, farm_id: farm.id }))

            // insert farm data
            await sql`
              insert into farmdata ${
                sql(validData, 'farm_id', 'datetimestamp', 'metrictype', 'metricvalue')
              }
            `

            // mark updated file
            await sql`
              insert into filesuploaded (
                filename
              ) values (
                ${filename}
              )
            `

            console.log(`File ${filename}: parsed ${rowCount} total rows, ${rowCount - validData.length} row(s) were discarded.`)
          })
      }
    })
  })
}
