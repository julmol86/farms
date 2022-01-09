import Table from 'react-bootstrap/Table'
import { useTranslation } from 'react-i18next';

const Statistics = () => {
    
    const { t } = useTranslation();
    
    return(
        <>
          
          <Table striped bordered hover>
            <thead>
                <tr>
                    <th>{t('stat.table.header.farmname')}</th>
                    <th>{t('stat.table.header.date')}</th>
                    <th>{t('stat.table.header.metrictype')}</th>
                    <th>{t('stat.table.header.metricvalue')}</th>
                </tr>
            </thead>
            {/* here will be data from DB */}
          </Table>
        </>
    )
}

export default Statistics;