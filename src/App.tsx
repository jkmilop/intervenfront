import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Actividad from './components/Actividad';
import Zona from './components/Zona';
import Ciudad from './components/Ciudad';
import Conjunto from './components/Conjunto';
import Empresa from './components/Empresa';
import GlobalActividades from './components/GlobalActividades';
import MaterialConstruccion from './components/MaterialConstruccion';
import Persona from './components/Persona';
import Proyecto from './components/Proyecto';
import Rol from './components/Rol';
import TipoActividad from './components/TipoActividad';
import TipoEstructura from './components/TipoEstructura';
import TipoVivienda from './components/TipoVivienda';
import Titulo from './components/Titulo';
import TrackerActividades from './components/TrackerActividades';
import UbicacionEstructura from './components/UbicacionEstructura';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actividad" element={<Actividad />} />
          <Route path="/zona" element={<Zona />} />
          <Route path="/ciudad" element={<Ciudad />} />
          <Route path="/conjunto" element={<Conjunto />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/global-actividades" element={<GlobalActividades />} />
          <Route path="/material-construccion" element={<MaterialConstruccion />} />
          <Route path="/persona" element={<Persona />} />
          <Route path="/proyecto" element={<Proyecto />} />
          <Route path="/rol" element={<Rol />} />
          <Route path="/tipo-actividad" element={<TipoActividad />} />
          <Route path="/tipo-estructura" element={<TipoEstructura />} />
          <Route path="/tipo-vivienda" element={<TipoVivienda />} />
          <Route path="/titulo" element={<Titulo />} />
          <Route path="/tracker-actividades" element={<TrackerActividades />} />
          <Route path="/ubicacion-estructura" element={<UbicacionEstructura />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;