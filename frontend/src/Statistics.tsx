import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import 'bootstrap/dist/css/bootstrap.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { LineChart, CartesianGrid, Line, Tooltip, XAxis, YAxis } from 'recharts'

const Statistics = () => {
  const { t, i18n } = useTranslation()
  const [statList, setStatList] = useState([])
  const [farms, setFarms] = useState([])
  const [farmId, setFarmId] = useState<string>()
  const [metricType, setMetricType] = useState<string>()
  const [month, setMonth] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()

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
      const response = await axios.get(`http://localhost:8091/data?farm=${farmId ?? ''}&metrictype=${metricType ?? ''}&month=${month ?? ''}&startdate=${startDate ?? ''}&enddate=${endDate ?? ''}`)
      setStatList(response.data)
    }
    // call function
    fetchStatList()
  }, [farmId, metricType, month, startDate, endDate])

  const columns = [
    {
      dataField: 'farmname',
      text: t('stat.table.header.farmname'),
      sort: true
    },
    {
      dataField: 'datetimestamp',
      text: t('stat.table.header.date'),
      // note: this column value does not refresh immediately on language change, potential bug in react-table component?
      formatter: (value: any) => <span>{new Date(value).toLocaleString(i18n.language === 'fi' ? 'fi-FI' : 'en-US')}</span>,
      sort: true
    },
    {
      dataField: 'metrictype',
      text: t('stat.table.header.metrictype'),
      // note: this column value does not refresh immediately on language change, potential bug in react-table component?
      formatter: (value: any) => <span>{t(`stat.table.data.metrictype.${value}`)}</span>,
      sort: true
    },
    {
      dataField: 'metricvalue',
      text: t('stat.table.header.metricvalue'),
      sort: true
    }
  ]

  const formatDateToString = (d: Date) => {
    return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate()
  }

  return (
        <>
          <div className = "mt-4">
            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.farm')}</Form.Label>
              <Form.Select defaultValue="" onChange={(e) => setFarmId(e.target.value)}>
                <option value="">-- {t('stat.form.allfarms')} --</option>
                {farms.map((x: any) => <option value={x.id} key={x.id}>{x.farmname}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.metrictype')}</Form.Label>
              <Form.Select defaultValue="" onChange={(e) => setMetricType(e.target.value)}>
                <option value="">-- {t('stat.form.allmetrics')} --</option>
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
              <Form.Control defaultValue="" type="date" onChange={(e) => setStartDate(e.target.value)} disabled={!!month}/>
            </Form.Group>

            <Form.Group className="mb-3 col-lg-3 col-md-6">
              <Form.Label>{t('stat.form.enddate')}</Form.Label>
              <Form.Control defaultValue="" type="date" onChange={(e) => setEndDate(e.target.value)} disabled={!!month}/>
            </Form.Group>

          </div>

          {farmId && metricType && (month || (startDate && endDate)) && (
            <LineChart
              width={1100}
              height={300}
              data={statList.map((x: any) => ({ ...x, dateformatted: formatDateToString(new Date(x.datetimestamp)) }))}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <XAxis dataKey="dateformatted" style={{ fontSize: '12px' }} />
              <YAxis dataKey="metricvalue" style={{ fontSize: '12px' }} />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="metricvalue" stroke="#198754" yAxisId={0} />
            </LineChart>
          )}

          <BootstrapTable
            bootstrap4
            keyField="id"
            data={statList}
            columns={columns}
            pagination={paginationFactory({ sizePerPage: 25 })}
          />

        </>
  )
}

export default Statistics
