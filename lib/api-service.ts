// Interfaces
export interface CiudadData {
    id: number
    nombre: string
}
export interface ProyectoData {
  id: number
  nombre: string
  direccion: string
  id_ciudad: number
  id_estado: number
  ciudad: {
    nombre: string
  }
  estado: {
    nombre: string
  }
}

export interface ConjuntoData {
  id: number
  nombre: string
  id_residente_encargado: number
  id_proyecto: number
  id_tipo_vivienda: number
  id_estado: number
  residente_encargado: {
    nombre: string
  }
  proyecto: {
    nombre: string
  }
  tipo_vivienda: {
    nombre: string
  }
  estado: {
    nombre: string
  }
}

export interface EstructuraData {
  conjunto: any
  id: number
  nombre: string
  id_conjunto: number
  id_tipo_estructura: number
  id_estado: number

  tipo_estructura: {
    nombre: string
  }
  estado: {
    nombre: string
  }
}

export interface ActividadEstructuraData {
  id: number
  id_actividad: number
  id_estructura: number
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  id_reporte: number
  id_estado: number
  estructura: {
    nombre: string
  }
  actividad: {
    nombre: string
  }
  estado: {
    nombre: string
  }
  reporte: {
    descripcion: string
    interventor?: {
      nombre: string
    }
    residente?: {
      nombre: string
    }
    contratista?: {
      nombre: string
    }
    resultado?: {
      id?: number
      nombre: string
    }
  }
}

export interface ReporteData {
  id: number
  id_interventor: number
  id_residente: number
  id_contratista: number
  descripcion_reporte: string
  interventor: {
    nombre: string
  }
  residente: {
    nombre: string
  }
  contratista: {
    nombre: string
  }
  resultado: {
    id?: number
    nombre: string
  }
}

export interface PersonaOption {
  id_rol: number
  id: number
  nombre: string
}

export interface ResultadoOption {
  id: number
  nombre: string
}

export interface TipoEstructuraOption {
  id: number
  nombre: string
}

export interface FormData {
  id?: number
  nombre: string
  direccion: string
  ciudad: string
}

export interface ReporteFormData {
  descripcion_reporte: string
  interventor: string
  residente: string
  contratista: string
  resultado: string
}

const API_BASE_URL = "http://localhost:4000"

// Servicio para proyectos
export const proyectosService = {
  fetchCiudades: async () => {
    try {
      const response = await fetch('http://localhost:4000/ciudad');
      if (!response.ok) {
        throw new Error(`Failed to fetch proyecto data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching proyecto data:", error);
      // Si hay un error de conexión, usar datos de ejemplo como fallback
    }
  },

  // Función para obtener todos los proyectos
  fetchProyectos: async () => {
    try {
      const response = await fetch('http://localhost:4000/proyecto');
      if (!response.ok) {
        throw new Error(`Failed to fetch proyecto data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching proyecto data:", error);
      // Si hay un error de conexión, usar datos de ejemplo como fallback
    }
  },

  // Función para obtener conjuntos por proyecto
  fetchConjuntosByProyecto: async () => {
    try {
      const response = await fetch('http://localhost:4000/conjunto');
      if (!response.ok) {
        throw new Error(`Failed to fetch conjunto data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching conjunto data:", error);
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener estructuras por conjunto
  fetchEstructurasByConjunto: async () => {
    try {
      const response = await fetch('http://localhost:4000/estructura');
      if (!response.ok) {
        throw new Error(`Failed to fetch estructura data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching estructura data:", error);
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener actividades por estructura
  fetchActividadesByEstructura: async () => {
    try {
      const response = await fetch('http://localhost:4000/actividades-estructura');
      if (!response.ok) {
        throw new Error(`Failed to fetch actividades data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching actividades data:", error);
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener personas (interventores, residentes, contratistas)
  fetchPersonas: async () => {
    try {
      const response = await fetch('http://localhost:4000/persona');
      if (!response.ok) {
        throw new Error(`Failed to fetch persona data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching persona data:", error);
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener resultados
  fetchResultados: async () => {
    try {
      const response = await fetch('http://localhost:4000/resultado');
      if (!response.ok) {
        throw new Error(`Failed to fetch resultado data`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching resultado data:", error);
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener reportes
  fetchReportes: async (): Promise<any[]> => {
    try {
      const response = await fetch('http://localhost:4000/reporte');
      if (!response.ok) {
        throw new Error(`Failed to fetch reporte data`);
      }
      const data = await response.json();
      return Array.isArray(data.records) ? data.records : data;
    } catch (error) {
      console.error("Error fetching reporte data:", error);
      return [];
    }
  },

  // Función para agregar un nuevo proyecto
  addProyecto: async (data: Omit<FormData, "id">): Promise<ProyectoData> => {
    try {
      const response = await fetch('http://localhost:4000/proyecto', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error al agregar proyecto: ${errorData.message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al agregar proyecto:", error);
      throw error;
    }
  },

  // Función para actualizar un proyecto existente
  updateProyecto: async (data: FormData): Promise<ProyectoData> => {
    try {
      const response = await fetch(`http://localhost:4000/proyecto/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error al actualizar proyecto: ${errorData.message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      throw error;
    }
  },

  // Función para eliminar un proyecto
  deleteProyecto: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:4000/proyecto/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error al eliminar proyecto: ${errorData.message || response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      throw error;
    }
  },
  updateEstructuraEstado: async (id: Number): Promise<ProyectoData> => {
    try {
      // Primero obtenemos los datos actuales de la estructura
      const response = await fetch(`http://localhost:4000/estructura/${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error al obtener estructura: ${errorData.message || response.statusText}`);
      }

      const estructuraActual = await response.json();

      // Actualizamos solo el campo id_estado
      const datosActualizados = {
        ...estructuraActual,
        id_estado: 3
      };

      // Realizamos la petición PUT con los datos actualizados
      const respuestaPut = await fetch(`http://localhost:4000/estructura/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!respuestaPut.ok) {
        const errorData = await respuestaPut.json().catch(() => ({}));
        throw new Error(`Error al actualizar estructura: ${errorData.message || respuestaPut.statusText}`);
      }

      return await respuestaPut.json();
    } catch (error) {
      console.error("Error al actualizar estructura:", error);
      throw error;
    }
  },

  // Función para crear o actualizar un reporte
  saveReporte: async (actividadId: number, data: ReporteFormData, reporteId?: number): Promise<any> => {
    try {
      // Convertir IDs de string a número
      const payload = {
        descripcion: data.descripcion_reporte,
        id_interventor: Number.parseInt(data.interventor),
        id_residente: Number.parseInt(data.residente),
        id_contratista: Number.parseInt(data.contratista),
        id_resultado: Number.parseInt(data.resultado),
        id_actividad: actividadId,
      };
      // Determinar si es crear o actualizar
      const isUpdate = Boolean(reporteId);
      const url = isUpdate ? `http://localhost:4000/reporte/${reporteId}` : `http://localhost:4000/reporte`;
      const method = isUpdate ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Error al ${isUpdate ? "actualizar" : "crear"} reporte`);
      }
      const responseData = await response.json();
      // Actualizar el estado de la actividad
      if (responseData.id) {
        await fetch(`http://localhost:4000/estructura/handleUpdateActividadEstructura/${responseData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      return responseData;
    } catch (error) {
      console.error("Error al guardar reporte:", error);
      throw error;
    }
  },

  // Función para obtener el porcentaje de avance de una estructura
  getEstructuraPorcentaje: async (estructuraId: number): Promise<number> => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/porcentaje/${estructuraId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener porcentaje de estructura ${estructuraId}`);
      }
      const data = await response.json();
      return data.porcentaje.porcentaje_actividades_completadas || 0;
    } catch (error) {
      console.error("Error al obtener porcentaje de estructura:", error);
      return 0;
    }
  },
  getEstructuraPorcentajeP: async (estructuraId: number): Promise<number> => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/porcentajeP/${estructuraId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener porcentaje de estructura ${estructuraId}`);
      }
      const data = await response.json();
      return data.porcentaje || 0;
    } catch (error) {
      console.error("Error al obtener porcentaje de estructura:", error);
      return 0;
    }
  },
  getEstructuraPorcentajeC: async (estructuraId: number): Promise<number> => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/porcentajeC/${estructuraId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener porcentaje de estructura ${estructuraId}`);
      }
      const data = await response.json();
      return data.porcentaje || 0;
    } catch (error) {
      console.error("Error al obtener porcentaje de estructura:", error);
      return 0;
    }
  },

  // Función para obtener todos los datos de formularios select
  fetchFormSelectData: async () => {
    try {
      const [reportesResponse, personasResponse, resultadosResponse] = await Promise.all([
        fetch('http://localhost:4000/reporte'),
        fetch('http://localhost:4000/persona'),
        fetch('http://localhost:4000/resultado'),
      ]);

      if (!reportesResponse.ok || !personasResponse.ok || !resultadosResponse.ok) {
        throw new Error('Failed to fetch form select data');
      }

      const [reportesData, personasData, resultadosData] = await Promise.all([
        reportesResponse.json(),
        personasResponse.json(),
        resultadosResponse.json(),
      ]);

      return {
        reportes: Array.isArray(reportesData.records) ? reportesData.records : reportesData,
        personas: Array.isArray(personasData.records) ? personasData.records : personasData,
        resultados: Array.isArray(resultadosData.records) ? resultadosData.records : resultadosData
      };
    } catch (error) {
      console.error('Error fetching form select data:', error);
      throw error;
    }
  }
};
// Servicio para estructuras
export const estructurasService = {
  // Función para obtener todas las estructuras
  fetchEstructuras: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/estructura`)
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error al obtener estructuras:", error)
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener conjuntos
  fetchConjuntos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/conjunto`)
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error al obtener conjuntos:", error)
      // Fallback con datos de ejemplo
    }
  },

  // Función para obtener tipos de estructura
  fetchTiposEstructura: async (): Promise<TipoEstructuraOption[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tipo-estructura`)
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error al obtener tipos de estructura:", error)
      // Fallback con datos de ejemplo
      return [
        { id: 1, nombre: "Edificio" },
        { id: 2, nombre: "Casa" },
        { id: 3, nombre: "Local Comercial" },
      ]
    }
  },

  // Función para agregar una nueva estructura
  addEstructura: async (data: any): Promise<EstructuraData> => {
    try {
      // Primer POST para agregar la estructura
      const response = await fetch(`${API_BASE_URL}/estructura`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: data.nombre,
          id_conjunto: Number(data.conjunto),
          id_tipo_estructura: Number(data.tipo_estructura),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al agregar estructura: ${errorData.message || "Error interno"}`)
      }

      // Obtener el ID de la estructura creada
      const responseData = await response.json()
      const estructuraId = responseData.id

      // Segundo POST para generar actividades
      await fetch(`${API_BASE_URL}/estructura/generar/${estructuraId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return responseData
    } catch (error) {
      console.error("Error al agregar o generar estructura:", error)
      throw error
    }
  },

  // Función para actualizar una estructura existente
  updateEstructura: async (data: any): Promise<EstructuraData> => {
    try {
      const estructuraId = Number(data.id)

      const response = await fetch(`${API_BASE_URL}/estructura/${estructuraId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: data.nombre,
          id_conjunto: Number(data.conjunto),
          id_tipo_estructura: Number(data.tipo_estructura),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al actualizar estructura: ${errorData.message || "Error interno"}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error al actualizar estructura:", error)
      throw error
    }
  },
  // Función para eliminar una estructura
  deleteEstructura: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/estructura/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error al eliminar estructura: ${errorData.message || "Error interno"}`)
      }

      return true
    } catch (error) {
      console.error("Error al eliminar estructura:", error)
      throw error
    }
  },
}

