import './weatherinformations.css'

function WeatherInformations({ weather }) {
  if (!weather?.weather) return null

  const temperature = Math.round(weather.main.temp)
  const feelsLike = Math.round(weather.main.feels_like)

  const minTemp = Math.round(weather.main.temp_min)
  const maxTemp = Math.round(weather.main.temp_max)

  const humidity = Math.round(weather.main.humidity)
  const pressure = Math.round(weather.main.pressure)

  const description = weather.weather[0].description
  const icon = weather.weather[0].icon
  const main = (weather.weather[0].main || '').toLowerCase()

  // hora local (sempre "agora" da cidade, usando timezone da OpenWeather)
  const tzMs = weather.timezone * 1000
  const nowUtcMs = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000)
  const cityNow = new Date(nowUtcMs + tzMs)

  const localTime = cityNow.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const localWeekday = cityNow.toLocaleDateString('pt-BR', {
    weekday: 'long',
  })

  // classe de animação por clima
  const iconClass =
    main.includes('thunder') ? 'icon-thunder' :
    main.includes('rain') ? 'icon-rain' :
    main.includes('drizzle') ? 'icon-rain' :
    main.includes('snow') ? 'icon-snow' :
    main.includes('cloud') ? 'icon-clouds' :
    main.includes('clear') ? 'icon-sun' :
    'icon-default'

  return (
    <div className="weather-container">
      <div className="header-row">
        <h2 className="city">{weather.name}</h2>
        <div className="localtime">
          <span className="weekday">{localWeekday}</span>
          <span className="time">{localTime}</span>
        </div>
      </div>

      <div className="weather-main">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt="Ícone do clima"
          className={`weather-icon ${iconClass}`}
        />

        <div className="temperature-box">
          <p className="temperature">{temperature}°</p>
          <p className="description">{description}</p>
        </div>
      </div>

      <div className="minmax">
        <span>{minTemp}°</span>
        <div className="minmax-bar"></div>
        <span>{maxTemp}°</span>
      </div>

      <div className="details">
        <div className="detail-item">
          <span className="label">Sensação</span>
          <span>{feelsLike}°C</span>
        </div>

        <div className="detail-item">
          <span className="label">Umidade</span>
          <span>{humidity}%</span>
        </div>

        <div className="detail-item">
          <span className="label">Pressão</span>
          <span>{pressure}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherInformations