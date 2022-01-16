import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { Container } from 'react-bootstrap'

// url to a valid topojson file
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const Maps = () => {
  const [farms, setFarms] = useState([])

  useEffect(() => {
    // fetch data from backend
    const fetchFarms = async () => {
      const response = await axios.get('http://localhost:8091/farms')
      setFarms(response.data)
    }
    // call function
    fetchFarms()
  }, [])

  return (
    <Container className='map-container' data-testid='maps-container'>
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        width={800}
        height={600}
        projectionConfig={{
          rotate: [-27, -65, 0],
          scale: 3200
        }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map((geo:any) =>
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            )}
          </Geographies>
          {farms.map((x: any) => (
            <Marker key={x.farmname} coordinates={[x.longitude, x.latitude]}>
              <circle r={8} fill="#198754" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={20}
                style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: '12px', fontWeight: 'bold' }}
              >
                {x.farmname}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </Container>
  )
}

export default Maps
