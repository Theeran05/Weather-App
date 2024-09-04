import cloud from './assets/cloud.jpg'
import clearsun from './assets/clearsun.png'
import drizzle from './assets/drizzle.png'
import humiditily from './assets/humiditily.png'
import rain from './assets/rain.png'
import snow from './assets/snow.jpg'
import wind from './assets/wind.png'
import clear from './assets/clear.jpg'

import './app.css'
import { useState } from 'react'
import { useEffect } from 'react'

// Weather Details main 
const WeatherDetails = ({ icon, temp, city, country, lat, lot, humidity, winds }) => {
  return (
    <>
      <div className="img">
        <img src={icon} alt="" />
      </div>
      <div className="temp">
        {temp} C°
      </div>
      <div className="location">
        {city}
      </div>
      <div className="country">
        {country}
      </div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='lot'>Longitude</span>
          <span>{lot}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humiditily} alt="wind" className="icon" />
          <div className="data">
            <div className="humiditily-percent">{humidity}%</div>
            <div className="text">Humiditiy</div>
          </div>
        </div>
        <div className="element">
          <img src={wind} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-speed">{winds} Km /h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}



// Main API and function and 
function App() {

  // Hooks of all components
  const [city, setcity] = useState("Puducherry")


  const [icon, seticon] = useState(clearsun)
  const [deg, setdeg] = useState(0)
  const [location, setlocation] = useState("")
  const [country, setcountry] = useState("")
  const [lat, setlat] = useState(0)
  const [lot, setlot] = useState(0)
  const [humidity, sethumidity] = useState(0)
  const [winds, setwinds] = useState(0)

  const [citynotfound, setcitynotfound] = useState(false)
  const [loading, setloading] = useState(false)
  const [err, seterr] = useState(null)

  // Weather Icon for main
  const weatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow
  }

  // core of the app is search the API
  const search = async () => {
    setloading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=93fa62f2bef79612be1a22e98886bf89&&units=Metric
`
    try {
      let res = await fetch(url)
      let data = await res.json()
      if (data.cod === '404') {
        console.error("City not found")
        setcitynotfound(true)
        setloading(false)
        return;
      }
      sethumidity(data.main.humidity);
      setwinds(data.wind.speed);
      setdeg(Math.floor(data.main.temp));
      setlocation(data.name);
      setcountry(data.sys.country);
      setlat(data.coord.lat);
      setlot(data.coord.lon);
      const weathericon = data.weather[0].icon;
      seticon(weatherIconMap[weathericon] || clearsun);
      setcitynotfound(false)
      seterr(false)

    } catch (error) {
      seterr("An error occurred while fetching weather data.");
      setcitynotfound(false)
    } finally {
      setloading(false)
    }
  }

  // input element was enter the city name
  const handelcity = (e) => {
    setcity(e.target.value)
  }

  // KeyDown "Enter" to Search function to enter the city
  const handelkeydown = (e) => {
    if (e.key === "Enter") {
      search()
    } 
  }
  useEffect(function () {
    search()
  }, [])

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityinput' placeholder='Seach City' value={city} onChange={handelcity} onKeyDown={handelkeydown} />
          <div className="seach-icon" onClick={() => search()}>
            <span>🔍</span>
          </div>
        </div>

        {loading && <div className="loading-message">Loading... </div>}
        {err && <div className="error-message">{err}</div>}
        {citynotfound && <div className="city-not-found">City not Found</div>}

        {!loading && !citynotfound && !err && <WeatherDetails
          icon={icon}
          temp={deg}
          city={location}
          country={country}
          lat={lat}
          lot={lot}
          humidity={humidity}
          winds={winds}
        />}
        <p className="copyright">Designed by <span>Theeran</span></p>
      </div>
    </>
  )
}

export default App
