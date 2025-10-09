import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import MessageScore from './MessageScore.jsx'
import About from './About.jsx'
import HowItWorks from './HowItWorks.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<MessageScore />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      <Analytics />
    </HashRouter>
  </React.StrictMode>,
)