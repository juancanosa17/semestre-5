# semestre-5

Material de estudio del **quinto semestre de Ingeniería en Sistemas** —
Universidad ORT Uruguay, grupo N5A nocturno, agosto 2026.

Son cinco páginas HTML autocontenidas: un panel con el calendario del semestre
y cuatro resúmenes completos para preparar los parciales. No usan librerías externas
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
Datos 2 (3839), Redes (3838) y Teoría de la Computación (6452). Las cuatro
tienen resumen propio y se abren desde la barra de navegación.

### Resumen · Diseño de Aplicaciones 1 (3924)

Doce capítulos en el orden en que se dan en clase: paradigma de objetos y UML,
herencia y polimorfismo, TDD, Clean Code, refactoring, los diagramas de paquetes
e interacción, GRASP, **SOLID**, **patrones de diseño** y la
**tecnología del práctico**: Git y GitFlow, arquitectura .NET, C#, excepciones,
LINQ, Blazor, DTOs, SQL Server con Docker y **Entity Framework** —el contexto y
sus estados, la carga de relacionadas, migraciones, Fluent API, el mapeo de
herencias TPH, TPT y TPC, las pruebas con la base en memoria y el publish—.

Abre con los dos obligatorios. El del **Obligatorio 2** (entrega 12/11) ordena la
letra cruzada con lo ya entregado: punto de partida del repositorio, persistencia
con EF Core sobre Azure SQL Edge, los siete requerimientos nuevos, cómo cambia el
modelo, preguntas para el foro, el repositorio manual de cada integrante, el
`AGENTS.md`, la documentación nueva, el video y un plan día a día. El del
**Obligatorio 1** tiene la letra y, ya entregado (v1.0.0, 8/10), su **cierre**
—qué se entregó, quién hizo qué, el diagrama de dominio final y los pendientes
que el equipo documentó—.

Los capítulos de POO y UML, TDD, **Clean Code**, **diagramas de secuencia**, GRASP y
**SOLID** están armados sobre los teóricos publicados: Clean Code recorre los
capítulos 1 a 8 del libro e incluye la actividad de refactoring y la hoja de
ejercicios resueltas, y el de secuencia explica cómo se lee el diagrama, sus
fragmentos (opt, alt, loop, ref) y pasa el ejercicio de clase de código a diagrama,
línea por línea. GRASP sigue el teórico completo —los nueve patrones con sus
ejemplos, el esquema que los relaciona y el ejercicio del hotel— y resuelve los
cuatro ejercicios de rediseño de la cátedra. SOLID sigue el teórico con sus
ejemplos (Empleado y sus actores, el pingüino que no vuela, la interfaz partida
por cliente, la interfaz que pertenece a la política) y su ejercicio de cierre.
El de tecnología sigue las clases del práctico y los proyectos `MovieManager` que
se muestran en ellas. El resto, sobre
el temario oficial —que fija tema por tema qué entra y de qué capítulo de qué
libro— y sobre las preguntas que efectivamente cayeron. El capítulo 0 marca cuál
es cuál, porque el resumen se completa a medida que la cátedra publica material.

Sus tres herramientas son clasificadores del ejercicio que más se repite:
**qué relación UML** corresponde a un fragmento de código, **qué principio SOLID**
viola un caso dado y **qué patrón** aplicar ante un problema concreto. A eso se
suma un **GitFlow paso a paso** con los comandos de cada rama, y
**17 preguntas reales resueltas** y **86 de autoevaluación**.

Sobre **14 parciales** de 2021 a 2024 se armó el análisis de frecuencia: SOLID
aparece en 13, patrones en 12, UML de clases en 11 y alguna pregunta de
tecnología (.NET, Git, Blazor, LINQ o Entity Framework) en 13. El parcial es de dos horas
y **sin material**.

### Resumen · Redes (3838)

Nueve capítulos sobre *Computer Networking: A Top-Down Approach* (Kurose &
Ross, 9.ª ed.), siguiendo el recorrido del curso desde la capa de aplicación
hacia abajo: qué es internet y el modelo de cinco capas, HTTP/1.1–2–3, DNS,
correo, sockets, UDP y TCP, control de flujo y de congestión, ruteo, la capa de
red y la de enlace.

Cada capítulo del 1 al 6 abre con un **mapa con zoom**: la capa entera en un solo dibujo, y cada parte marcada se abre acercando la cámara para mostrar lo que tiene adentro —el core de Internet, un router por dentro, el segmento TCP, Dijkstra, la trama Ethernet—, hasta cuatro o cinco niveles de profundidad y más de 100 escenas animadas.

Incluye además **27 herramientas interactivas** —entre ellas un simulador de
resolución DNS, uno de rdt3.0 con los cuatro escenarios de stop-and-wait, una comparación paso a paso de Go-Back-N y Selective Repeat, uno de ventana deslizante, una línea de tiempo de TCP,
calculadoras de CRC, checksum y subredes, y un mapa navegable de internet— más
**124 preguntas de autoevaluación**.

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
jerarquía, un paso a paso que lleva un árbol canónico al plan lógico aplicando
las heurísticas de a una, y calculadoras de propagación de privilegios,
Bell-LaPadula y costos de acceso.

Los capítulos del primer parcial —integridad, seguridad y optimización de
consultas— siguen los teóricos de la cátedra, con sus ejemplos y ejercicios
resueltos.

Incluye **17 bloques con preguntas reales** resueltas y **44 de autoevaluación**,
sobre el análisis de **6 parciales** de 2024 y 2025.

### Resumen · Teoría de la Computación (6452)

Diez capítulos que cubren el programa completo: recursión y semántica
operacional, teoría de conjuntos y numerabilidad, el lenguaje **χ**, el
**cálculo lambda puro**, **Imp** y las **máquinas de Turing**, computabilidad
—problema de la detención, reducciones, teorema de Rice— y complejidad.

Las **máquinas de Turing** suman sus variantes (siempre escriben, multicabezal,
bidimensional, multicinta, no determinista) y la máquina universal, con el
cierre de la equivalencia de modelos. La **complejidad** sigue las diapositivas
del curso y las clases del 10 y el 11/11: notación asintótica O, Ω y Θ con los
pizarrones, P, EXP y la jerarquía temporal, NP por certificado, reducciones
polinomiales, NP-completitud y Cook-Levin, la hoja de problemas clásicos y las
reducciones resueltas en clase (IS ≤p Clique, SAT ≤p 3-SAT, 3-SAT ≤p Clique y
el Profesor Desorganizado desde k-Color).

Sus **9 herramientas interactivas** incluyen un β-reductor real del cálculo
lambda (con sustitución que evita captura de variables y las dos estrategias de
evaluación), un simulador de máquinas de Turing programable, árboles de
derivación de χ paso a paso, las deducciones de Imp del práctico 2 (NOT, AND y length con while,
con la memoria final que baja hasta la raíz), el emparejamiento de Cantor y un
clasificador de decidibilidad. Suma **109 preguntas de autoevaluación**.

Incluye además el **Práctico 0** completo — el lenguaje de expresiones de
conjuntos finitos de enteros, con su sintaxis abstracta, las nueve reglas de
semántica operacional, la implementación en Haskell y las extensiones de la
parte 6 — con un evaluador que ejecuta esas reglas y muestra el árbol de
derivación.

El primer capítulo es una radiografía de **15 parciales** de 2019 a 2026: qué
tema aparece en cada uno, los cinco ejercicios que se repiten y un plan de
estudio derivado de eso. A lo largo del texto hay **18 bloques con preguntas
reales** y su resolución.

Está armado sobre las notas de cátedra y las diapositivas de **Diego Acuña**,
los repartidos de **Á. Tasistro** y **E. Copello**, el repositorio `TC_Marzo26`
de la edición del curso y las clases grabadas, con enlaces al minuto (Vimeo
para el grupo de la noche, Panopto para el de la mañana).

---

## Estructura del repositorio

```
index.html          la página del sitio
lector.css/.js      distribución por tema y subrayado de los resúmenes
data/               los documentos publicados
tools/lock.js       regenera data/ a partir de los HTML locales
tools/sources.json  dónde están los originales en la máquina local
```

Los HTML originales no viven acá: se editan por fuera y este repositorio
publica el resultado.

### Cómo se leen los resúmenes

El visor inyecta `lector.css` y `lector.js` en cada resumen (no en el panel).
Sin tocar los HTML originales, los reacomoda en **un tema por vez**: migas
«Materias › Materia › Tema N», la cabecera del tema en una tarjeta con el color
de la materia, cada subtema en su tarjeta y, a la derecha, **En este tema** con
el progreso, la lista de temas, las clases citadas y los subrayados.

Se puede **subrayar** en cinco colores: se selecciona texto de un subtema y se
elige el color; tocando un subrayado se cambia el color o se borra. Los
subrayados y el último tema abierto se guardan en el navegador
(`localStorage`, claves `lector:<materia>:…`), igual que el progreso de estudio.
Si se cambian `lector.css` o `lector.js`, subir `LECTOR_V` en `index.html`
para que el navegador no use la versión vieja.

## Publicar cambios

Después de editar los originales:

```bash
node tools/lock.js
git add data && git commit -m "Actualiza el contenido" && git push
```

GitHub Pages levanta la versión nueva en un par de minutos.
