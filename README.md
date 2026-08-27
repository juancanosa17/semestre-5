# semestre-5

Material de estudio del **quinto semestre de Ingeniería en Sistemas** —
Universidad ORT Uruguay, grupo N5A nocturno, agosto 2026.

Son cuatro páginas HTML autocontenidas: un panel con el calendario del semestre
y tres resúmenes completos para preparar los parciales. No usan librerías externas
ni conexión a internet — todo el contenido, los gráficos y las herramientas
interactivas viven dentro de cada archivo.

**→ [juancanosa17.github.io/semestre-5](https://juancanosa17.github.io/semestre-5/)**

---

## Los documentos

### Semestre 5 · el panel

El punto de entrada. Reúne todo lo administrativo del semestre en un solo lugar:

- **Calendario mensual** con las 130 clases del período, marcables como vistas,
  con feriados, parciales, defensas y entregas superpuestos. Recuerda el
  progreso entre sesiones.
- **Horario semanal** de las cuatro materias, con módulo y modalidad de cada
  bloque (HYFLEX, laboratorio, presencial).
- **Calendario de eventos** filtrable: lecturas y entregas de obligatorios,
  parciales, segundas instancias, clases de consulta y feriados.
- **Estructura de evaluación** de cada materia, con simulador de puntaje para
  calcular cuánto necesitás en el parcial según lo que ya tengas, y un bloc de
  notas por materia.

Las cuatro materias del semestre son Diseño de Aplicaciones 1 (3924), Bases de
Datos 2 (3839), Redes (3838) y Teoría de la Computación (6452). Las tres últimas
tienen resumen propio y se abren desde la barra de navegación.

### Resumen · Redes (3838)

Nueve capítulos sobre *Computer Networking: A Top-Down Approach* (Kurose &
Ross, 9.ª ed.), siguiendo el recorrido del curso desde la capa de aplicación
hacia abajo: qué es internet y el modelo de cinco capas, HTTP/1.1–2–3, DNS,
correo, sockets, UDP y TCP, control de flujo y de congestión, ruteo, la capa de
red y la de enlace.

Incluye **19 herramientas interactivas** —entre ellas un simulador de
resolución DNS, uno de ventana deslizante, una línea de tiempo de TCP,
calculadoras de CRC, checksum y subredes, y un mapa navegable de internet— más
**122 preguntas de autoevaluación**.

Sobre **52 parciales** de años anteriores se armó un análisis de frecuencia por
tema y se intercalaron **67 preguntas reales** después de la sección que las
responde.

### Resumen · Bases de Datos 2 (3839)

Doce capítulos sobre el material de la Cátedra de Bases de Datos. La materia
tiene **dos parciales que son dos programas distintos**, y el resumen los separa:
el primero cubre integridad, seguridad, optimización de consultas y la evolución
de los DBMS hasta NoSQL; el segundo, transacciones, recuperabilidad, seriabilidad,
candados y 2PL, granularidad múltiple y recuperación ante fallas.

Su herramienta central es un **analizador de planes**: se le pega un plan
entrelazado —vienen cargados los seis de los parciales del archivo— y resuelve
los cuatro primeros ejercicios, con el grafo de precedencia dibujado, la
clasificación por recuperabilidad y el veredicto de 2PL en sus seis variantes,
señalando el conflicto exacto que impide cada una. Lo acompañan un simulador de
recuperación con checkpoint y falla, uno de candados de intención sobre la
jerarquía, y calculadoras de propagación de privilegios, Bell-LaPadula y costos
de acceso.

Incluye **17 bloques con preguntas reales** resueltas y **33 de autoevaluación**,
sobre el análisis de **6 parciales** de 2024 y 2025.

### Resumen · Teoría de la Computación (6452)

Diez capítulos que cubren el programa completo: recursión y semántica
operacional, teoría de conjuntos y numerabilidad, el lenguaje **χ**, el
**cálculo lambda puro**, **Imp** y las **máquinas de Turing**, computabilidad
—problema de la detención, reducciones, teorema de Rice— y complejidad P/NP.

Sus **8 herramientas interactivas** incluyen un β-reductor real del cálculo
lambda (con sustitución que evita captura de variables y las dos estrategias de
evaluación), un simulador de máquinas de Turing programable, árboles de
derivación de χ paso a paso, el emparejamiento de Cantor y un clasificador de
decidibilidad. Suma **96 preguntas de autoevaluación**.

Incluye además el **Práctico 0** completo — el lenguaje de expresiones de
conjuntos finitos de enteros, con su sintaxis abstracta, las nueve reglas de
semántica operacional, la implementación en Haskell y las extensiones de la
parte 6 — con un evaluador que ejecuta esas reglas y muestra el árbol de
derivación.

El primer capítulo es una radiografía de **15 parciales** de 2019 a 2026: qué
tema aparece en cada uno, los cinco ejercicios que se repiten y un plan de
estudio derivado de eso. A lo largo del texto hay **17 bloques con preguntas
reales** y su resolución.

Está armado sobre las notas de cátedra de **Diego Acuña**, los repartidos de
**Á. Tasistro** y **E. Copello**, y el repositorio `TC_Marzo26` de la edición
del curso.

---

## Estructura del repositorio

```
index.html          la página del sitio
data/               los documentos publicados
tools/lock.js       regenera data/ a partir de los HTML locales
tools/sources.json  dónde están los originales en la máquina local
```

Los HTML originales no viven acá: se editan por fuera y este repositorio
publica el resultado.

## Publicar cambios

Después de editar los originales:

```bash
node tools/lock.js
git add data && git commit -m "Actualiza el contenido" && git push
```

GitHub Pages levanta la versión nueva en un par de minutos.
