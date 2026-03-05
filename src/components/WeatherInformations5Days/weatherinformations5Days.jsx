import './weatherinformations5Days.css'

function WeatherInformations5Days({ weather5Days }) {
  if (!weather5Days?.list?.length) return null

  function formatDay(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { weekday: 'short' })
  }

  // 1) agrupa todas as previsões por dia (YYYY-MM-DD)
  const byDay = weather5Days.list.reduce((acc, item) => {
    const dayKey = item.dt_txt.slice(0, 10) // "YYYY-MM-DD"
    if (!acc[dayKey]) acc[dayKey] = []
    acc[dayKey].push(item)
    return acc
  }, {})

  // 2) transforma em 5 dias: min/max reais do dia + item representativo (12:00)
  const dailyForecast = Object.keys(byDay)
    .sort()
    .slice(0, 5)
    .map((dayKey) => {
      const items = byDay[dayKey]

      let min = Infinity
      let max = -Infinity

      for (const it of items) {
        if (it.main.temp_min < min) min = it.main.temp_min
        if (it.main.temp_max > max) max = it.main.temp_max
      }

      // item representativo (preferir 12:00, senão pega o do meio)
      const atNoon = items.find(it => it.dt_txt.includes('12:00:00'))
      const rep = atNoon || items[Math.floor(items.length / 2)]

      return {
        dayKey,
        dt: rep.dt,
        dt_txt: rep.dt_txt,
        icon: rep.weather[0].icon,
        description: rep.weather[0].description,
        temp: rep.main.temp,
        min,
        max
      }
    })

  return (
    <div className="weather-container">
      <p>Próximos 5 Dias</p>

      {dailyForecast.map((item, index) => (
        <div
          className="forecast-item"
          key={item.dayKey}
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <p className="forecast-day">{formatDay(item.dt_txt)}</p>

          <img
            src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
            alt="Ícone do clima"
            className="forecast-icon"
          />

          <div className="forecast-meta">
            <p className="forecast-desc">{item.description}</p>
            <p className="forecast-minmax">
              <span className="min">{Math.round(item.min)}°</span>
              <span className="sep">/</span>
              <span className="max">{Math.round(item.max)}°</span>
            </p>
          </div>

          <p className="forecast-temp">{Math.round(item.temp)}°C</p>
        </div>
      ))}
    </div>
  )
}

export default WeatherInformations5Days