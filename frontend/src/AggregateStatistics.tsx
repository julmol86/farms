/* farm nae. min, max, average, count */
import React from 'react'
import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next'

const AggregateStatistics = () => {
  const { t } = useTranslation()

  return (
        <>

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
            {/* here will be data from DB */}
          </Table>
        </>
  )
}

export default AggregateStatistics
