import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

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
    <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
              rotate: [-27, -66, 0],
              scale: 2500
            }}
          >
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
                <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  y={20}
                  style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: '8px' }}
                >
                  {x.farmname}
                </text>
              </Marker>
            ))}
    </ComposableMap>
  )
}

export default Maps
