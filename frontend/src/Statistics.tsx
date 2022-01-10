import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next'

const Statistics = () => {
  const { t, i18n } = useTranslation()
  const [statList, setStatList] = useState([])
  const [farms, setFarms] = useState([])
  const [farmId, setFarmId] = useState<string>()
  const [metricType, setMetricType] = useState<string>()
  const [startDate, setStartDate] = useState<string>('2019-01-01')
  const [endDate, setEndDate] = useState<string>('2019-01-05')

  useEffect(() => {
    // fetch data from backend
    const fetchFarms = async () => {
      const response = await axios.get('http://localhost:8091/farms')
      setFarms(response.data)
    }
    // call function
    fetchFarms()
  }, [])

  useEffect(() => {
    // fetch data from backend
    const fetchStatList = async () => {
      const response = await axios.get(`http://localhost:8091/data?farm=${farmId ?? ''}&metrictype=${metricType ?? ''}&startdate=${startDate ?? ''}&enddate=${endDate ?? ''}`)
      setStatList(response.data)
    }
    // call function
    fetchStatList()
  }, [farmId, metricType, startDate, endDate])
  return (
        <>
          <Form.Label>{t('stat.form.farm')}</Form.Label>
          <Form.Select defaultValue="" onChange={(e) => setFarmId(e.target.value)}>
            <option value="">-- {t('stat.form.allfarms')} --</option>
            {farms.map((x: any) => <option value={x.id} key={x.id}>{x.farmname}</option>)}
          </Form.Select>

          <Form.Label>{t('stat.form.metrictype')}</Form.Label>
          <Form.Select defaultValue="" onChange={(e) => setMetricType(e.target.value)}>
            <option value="">-- {t('stat.form.allmetrics')} --</option>
            <option value="temperature">{t('stat.form.temperature')}</option>
            <option value="rainfall">{t('stat.form.rainfall')}</option>
            <option value="ph">{t('stat.form.ph')}</option>
          </Form.Select>

          <Form.Label>{t('stat.form.startdate')}</Form.Label>
          <Form.Control defaultValue="2019-01-01" type="date" onChange={(e) => setStartDate(e.target.value)} />

          <Form.Label>{t('stat.form.enddate')}</Form.Label>
          <Form.Control defaultValue="2019-01-05" type="date" onChange={(e) => setEndDate(e.target.value)} />

          <span>{t('stat.form.maxcount')}</span>

          <Table className = "mt-4" striped bordered hover>
            <thead>
                <tr>
                    <th>{t('stat.table.header.farmname')}</th>
                    <th>{t('stat.table.header.date')}</th>
                    <th>{t('stat.table.header.metrictype')}</th>
                    <th>{t('stat.table.header.metricvalue')}</th>
                </tr>
            </thead>
            <tbody>
                {statList.map((x: any, idx) => (
                    <tr key={idx}>
                        <td>{x.farmname}</td>
                        <td>{new Date(x.datetimestamp).toLocaleString(i18n.language === 'fi' ? 'fi-FI' : 'en-US')}</td>
                        <td>{x.metrictype}</td>
                        <td>{x.metricvalue}</td>
                    </tr>
                ))}
            </tbody>
          </Table>
        </>
  )
}

export default Statistics
