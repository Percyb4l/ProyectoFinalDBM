import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>VriSA</h1>
        <p>Vigilancia de la Red de Inmisiones y Sustancias Atmosféricas</p>
      </header>

      <main>
        <div className="card">
          <h2>Estado del Sistema</h2>
          <p>Bienvenido al panel de control.</p>
          <button>Ver Estaciones</button>
        </div>
      </main>
    </div>
  )
}

export default App