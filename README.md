# SCI Trainer

Simulador docente interactivo para cursos de Sistema de Comando de Incidentes.

El objetivo no es reemplazar una certificacion oficial. Es una base de software para practicar y evaluar decisiones: establecimiento de mando, organizacion modular, seguridad, objetivos, recursos, comunicaciones, escalamiento y registro.

## Estado

- Frontend React + TypeScript + Vite.
- Motor local de simulacion por reducer.
- Escenario inicial: incendio estructural con exposicion, lesionado y riesgo de propagacion.
- Roles: alumno e instructor en una misma pantalla.
- Rúbrica, eventos, recursos, línea de tiempo, organigrama SCI y tablero visual 2.5D.

## Instalación

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5177
```

## Estructura

```text
src/
  components/       UI modular
  data/             escenarios, rubricas, doctrina SCI
  engine/           reglas, reducer y scoring
  hooks/            estado de simulacion
  types/            contratos TypeScript
  utils/            utilidades
```

## Fuentes doctrinarias usadas para esta version

- Bomberos de Chile: Guia Nacional de Operaciones - SCI.
- Academia Nacional de Bomberos: Curso Basico Sistema de Comando de Incidentes.
- FEMA: ICS-100, Introduction to the Incident Command System.
- Bomberos de Chile: Guia Nacional de Operaciones - Incendios Forestales.
- ANB: PRIMAP, primera respuesta a incidentes con materiales peligrosos.

## Mejoras sugeridas

- Separar modo alumno e instructor con autenticacion.
- Agregar banco de escenarios por tipo: incendio, rescate vehicular, MATPEL, forestal, evacuacion.
- Exportar informe PDF.
- Persistencia en Firebase o Supabase.
- Reproduccion de sesion con decisiones por minuto.
- Motor 3D con Three.js para versiones enterprise.
