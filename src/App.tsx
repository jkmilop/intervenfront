import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Actividad from './components/Actividad';
import ActividadesEstructura from './components/ActividadesEstructura';
import Capitulo from './components/Capitulo';
import Ciudad from './components/Ciudad';
import Conjunto from './components/Conjunto';
import ConjuntoCard from './components/ConjuntoCard';

import Diseño from './components/Diseño';
import Estructura from './components/Estructura';
import Etapa from './components/Etapa';
import ProyectoCard from './components/ProyectoCard';

import EstructuraCard from './components/EstructuraCard';
import MaterialesEstructura from './components/MaterialesEstructura';
import Persona from './components/Persona';
import Proyecto from './components/Proyecto';
import Rol from './components/Rol';
import TipoActividad from './components/TipoActividad';
import TipoEstructura from './components/TipoEstructura';
import TipoVivienda from './components/TipoVivienda';
import Titulo from './components/Titulo';
import UbicacionEstructura from './components/UbicacionEstructura';
import Zona from './components/Zona';
import ZonaEstructura from './components/ZonaEstructura';
import Reporte from './components/Reporte';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actividad" element={<Actividad />} />
          <Route path="/actividades-estructura" element={<ActividadesEstructura />} />
          <Route path="/capitulo" element={<Capitulo />} />
          <Route path="/ciudad" element={<Ciudad />} />
          <Route path="/conjunto" element={<Conjunto />} />
          <Route path="/diseno" element={<Diseño />} />
          <Route path="/diseno" element={<Diseño />} />
          <Route path="/reporte" element={<Reporte />} />
          <Route path="/estructura" element={<Estructura />} />
          <Route path="/etapa" element={<Etapa />} />
          <Route path="/estructura-card" element={<EstructuraCard />} />
          <Route path="/proyecto-card" element={<ProyectoCard />} />
          <Route path="/conjunto-card" element={<ConjuntoCard />} />
          <Route path="/materiales-estructura" element={<MaterialesEstructura />} />
          <Route path="/persona" element={<Persona />} />
          <Route path="/proyecto" element={<Proyecto />} />
          <Route path="/rol" element={<Rol />} />
          <Route path="/tipo-actividad" element={<TipoActividad />} />
          <Route path="/tipo-estructura" element={<TipoEstructura />} />
          <Route path="/tipo-vivienda" element={<TipoVivienda />} />
          <Route path="/titulo" element={<Titulo />} />
          <Route path="/ubicacion-estructura" element={<UbicacionEstructura />} />
          <Route path="/zona" element={<Zona />} />
          <Route path="/zona-estructura" element={<ZonaEstructura />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;