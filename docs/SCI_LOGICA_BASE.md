# Logica base SCI aplicada al simulador

Esta carpeta documenta como se tradujo doctrina SCI a reglas de software.

## Supuestos de diseno

1. El simulador es docente, no operacional.
2. La evaluacion se centra en decisiones observables.
3. Las decisiones correctas dependen del momento, riesgo y recursos disponibles.
4. El instructor puede inyectar eventos para probar adaptacion.
5. El sistema debe registrar linea de tiempo para retroalimentacion.

## Elementos SCI implementados

- Mando: establecimiento y transferencia.
- Organizacion modular: expansion segun complejidad.
- Unidad de mando y cadena de mando.
- Comando unificado cuando hay multiples instituciones.
- Manejo por objetivos.
- Plan de accion del incidente.
- Alcance de control.
- Gestion de recursos.
- Comunicaciones integradas.
- Seguridad, informacion publica y enlace.

## Traduccion a reglas

- Si no se establece mando en los primeros minutos, baja el control.
- Si no se declara seguridad, aumenta el riesgo.
- Si se piden recursos sin objetivos, aumenta la sobrecarga.
- Si se crean cargos sin necesidad, aumenta la complejidad.
- Si se asignan sectores cuando el incidente crece, mejora la coordinacion.
- Si se ignora una exposicion, aumenta la propagacion.
- Si se activa evacuacion y perimetro, mejora seguridad publica.

## Advertencia

Las ponderaciones son iniciales. Deben validarse con instructores SCI acreditados antes de usarlas como evaluacion formal.
