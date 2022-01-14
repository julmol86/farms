import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next'

const AggregateStatistics = () => {
  const { t } = useTranslation()
  const [aggList, setAggList] = useState([])
  const [metricType, setMetricType] = useState<string>('temperature')
  const [month, setMonth] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()

  useEffect(() => {
    // fetch data from backend
    const fetchAggList = async () => {
      const response = await axios.get(`http://localhost:8091/aggregate?metrictype=${metricType}&month=${month ?? ''}&startdate=${startDate ?? ''}&enddate=${endDate ?? ''}`)
      setAggList(response.data)
    }
    // call function
    fetchAggList()
  }, [metricType, month, startDate, endDate])

  return (
        <>
          <div className = "mt-4">
            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.metrictype')}</Form.Label>
              <Form.Select defaultValue="temperature" onChange={(e) => setMetricType(e.target.value)}>
                <option value="temperature">{t('stat.form.temperature')}</option>
                <option value="rainfall">{t('stat.form.rainfall')}</option>
                <option value="ph">{t('stat.form.ph')}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.month')}</Form.Label>
              <Form.Select defaultValue="" onChange={(e) => setMonth(e.target.value)}>
                <option value="">-- {t('stat.form.nomonthselected')} --</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x: number) => <option value={x} key={x}>{t(`stat.form.month.option.${x}`)}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.startdate')}</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} disabled={!!month}/>
            </Form.Group>

            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.enddate')}</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)} disabled={!!month}/>
            </Form.Group>
          </div>

          <Table className = "mt-4" striped bordered hover>
            <thead>
                <tr>
                    <th>{t('aggstat.table.header.farmname')}</th>
                    <th>{t('aggstat.table.header.min')}</th>
                    <th>{t('aggstat.table.header.max')}</th>
                    <th>{t('aggstat.table.header.avg')}</th>
                    <th>{t('aggstat.table.header.count')}</th>
                </tr>
            </thead>
            <tbody>
                {aggList.map((x: any, idx) => (
                    <tr key={idx}>
                        <td>{x.farmname}</td>
                        <td>{x.min}</td>
                        <td>{x.max}</td>
                        <td>{x.avg}</td>
                        <td>{x.count}</td>
                    </tr>
                ))}
            </tbody>
          </Table>
        </>
  )
}

export default AggregateStatistics
