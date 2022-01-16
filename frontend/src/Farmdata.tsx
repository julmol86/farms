import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { formdataSchema, FormdataType } from './formdataSchema'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

const Farmdata = () => {
  const { t, i18n } = useTranslation()
  const { userData } = useContext(UserContext)
  const [farmdata, setFarmdata] = useState<any>([])
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(formdataSchema)
  })
  const onSubmitFunc = async (data: FormdataType) => {
    try {
      const farmadataNew = await axios.post(
        'http://localhost:8091/insertfarmdata',
        { ...data, farm: userData.farmId }
      )
      setFarmdata([farmadataNew.data[0], ...farmdata])
      reset()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // fetch data from backend
    const fetchFarms = async () => {
      const response = await axios.get(`http://localhost:8091/farm/${userData.farmId}/farmdata`)
      setFarmdata(response.data)
    }
    // call function
    fetchFarms()
  }, [])

  const columns = [
    {
      dataField: 'datetimestamp',
      text: t('stat.table.header.date'),
      // note: this column value does not refresh immediately on language change, potential bug in react-table component?
      formatter: (value: any) => <span>{new Date(value).toLocaleString(i18n.language === 'fi' ? 'fi-FI' : 'en-US')}</span>
    },
    {
      dataField: 'metrictype',
      text: t('stat.table.header.metrictype'),
      // note: this column value does not refresh immediately on language change, potential bug in react-table component?
      formatter: (value: any) => <span>{t(`stat.table.data.metrictype.${value}`)}</span>
    },
    {
      dataField: 'metricvalue',
      text: t('stat.table.header.metricvalue')
    }
  ]

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmitFunc)}>
        <h2>{t('farmdata.title')}</h2>
        <br />

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('farmdata.metrictype')} *</Form.Label>
          <Form.Select {...register('metrictype')} data-testid='farmdata-metrictype' defaultValue="temperature" className={`form-control ${errors.metrictype ? 'is-invalid' : ''}`}>
            <option value="temperature">{t('stat.form.temperature')}</option>
            <option value="rainfall">{t('stat.form.rainfall')}</option>
            <option value="ph">{t('stat.form.ph')}</option>
          </Form.Select>
          <Form.Text className="invalid-feedback">
            {errors.metrictype?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('farmdata.metricvalue')} *</Form.Label>
          <Form.Control {...register('metricvalue')} data-testid='farmdata-metricvalue' type="text" className={`form-control ${errors.metricvalue ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {t(errors.metricvalue?.message)}
          </Form.Text>
        </Form.Group>

        <Button variant="success" type="submit" data-testid='farmdata-button'>
          {t('farmdata.submit')}
        </Button>
      </Form>

      <div data-testid='farmdata-table'>
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={farmdata}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 10 })}
        />
      </div>
    </>
  )
}

export default Farmdata
