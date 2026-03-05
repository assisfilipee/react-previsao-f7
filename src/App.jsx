import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import WeatherInformations from './components/WeatherInformations/weatherinformations'
import WeatherInformations5Days from './components/WeatherInformations5Days/weatherinformations5Days'
import logo from './assets/logo.png'

function App() {
  const [weather, setWeather] = useState(null)
  const [weather5Days, setWeather5Days] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function applyThemeFromWeather(data) {
    if (!data?.weather?.[0]) return

    const main = (data.weather[0].main || '').toLowerCase() // clear, clouds, rain...
    const icon = data.weather[0].icon || '' // "01d" / "01n"
    const isNight = icon.endsWith('n')

    // paletas (pode ajustar depois)
    const themes = {
      clear: {
        day: { a: '#2DD4BF', b: '#0EA5E9', c: 'rgba(255,255,255,0.20)', text: '#ffffff' },
        night:{ a: '#0B1020', b: '#1E3A8A', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      clouds: {
        day: { a: '#38BDF8', b: '#0E7490', c: 'rgba(255,255,255,0.20)', text: '#ffffff' },
        night:{ a: '#0F172A', b: '#334155', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      rain: {
        day: { a: '#0EA5E9', b: '#1D4ED8', c: 'rgba(255,255,255,0.18)', text: '#ffffff' },
        night:{ a: '#0B1220', b: '#0F2A4D', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      drizzle: {
        day: { a: '#22C55E', b: '#0EA5E9', c: 'rgba(255,255,255,0.18)', text: '#ffffff' },
        night:{ a: '#07131A', b: '#0F2A4D', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      thunderstorm: {
        day: { a: '#7C3AED', b: '#0EA5E9', c: 'rgba(255,255,255,0.18)', text: '#ffffff' },
        night:{ a: '#12061C', b: '#2E1065', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      snow: {
        day: { a: '#E0F2FE', b: '#38BDF8', c: 'rgba(255,255,255,0.28)', text: '#0B1220' },
        night:{ a: '#0B1220', b: '#0EA5E9', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      mist: {
        day: { a: '#94A3B8', b: '#0EA5E9', c: 'rgba(255,255,255,0.18)', text: '#ffffff' },
        night:{ a: '#0F172A', b: '#475569', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
      default: {
        day: { a: '#14a5d1', b: '#107897', c: 'rgba(255,255,255,0.20)', text: '#ffffff' },
        night:{ a: '#0B1020', b: '#0F2A4D', c: 'rgba(255,255,255,0.14)', text: '#ffffff' },
      },
    }

    const key =
      main.includes('cloud') ? 'clouds' :
      main.includes('rain') ? 'rain' :
      main.includes('drizzle') ? 'drizzle' :
      main.includes('thunder') ? 'thunderstorm' :
      main.includes('snow') ? 'snow' :
      main.includes('mist') || main.includes('fog') || main.includes('haze') ? 'mist' :
      main.includes('clear') ? 'clear' :
      'default'

    const palette = themes[key][isNight ? 'night' : 'day']

    const root = document.documentElement
    root.style.setProperty('--bg-a', palette.a)
    root.style.setProperty('--bg-b', palette.b)
    root.style.setProperty('--glass', palette.c)
    root.style.setProperty('--text', palette.text)
  }

  useEffect(() => {
    if (weather) applyThemeFromWeather(weather)
  }, [weather])

  async function searchCity() {
    const city = inputRef.current?.value.trim()
    if (!city) return

    setError('')

    const key = '05b812c89d402a27c24a9c1488ea961f'

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=pt_br`

    const url5days =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=pt_br`

    try {
      const [apiInfo, apiInfo5days] = await Promise.all([
        axios.get(url),
        axios.get(url5days),
      ])

      setWeather(apiInfo.data)
      setWeather5Days(apiInfo5days.data)
    } catch (err) {
      setWeather(null)
      setWeather5Days(null)

      const status = err?.response?.status
      if (status === 404) setError('Cidade não encontrada. Verifique o nome e tente novamente.')
      else setError('Erro ao buscar previsão. Tente novamente em alguns segundos.')
    }
  }

  return (
    <div className="container">
      <div className="app-header">
        <img src={logo} alt="F7 Logo" className="app-logo" />
        <h1 className="app-title">Previsão do Tempo</h1>
      </div>

      <div className="search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Digite o nome da cidade..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') searchCity()
          }}
        />
        <button onClick={searchCity}>Buscar</button>
      </div>

      {error && <p style={{ color: 'var(--text)', marginTop: 12 }}>{error}</p>}

      {weather && <WeatherInformations weather={weather} />}
      {weather5Days && <WeatherInformations5Days weather5Days={weather5Days} />}

      <footer className="app-footer">
        © 2026 Filipe Assis. Todos os direitos reservados.
      </footer>
    </div>
  )
}

export default App