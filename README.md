# Reparify
Plataforma web para conectar usuarios con profesionales del hogar. Permite describir un problema doméstico, obtener un diagnóstico orientativo y agendar un turno con el profesional indicado.

🔗 [Link App](https://reparify.netlify.app/)

Desarrollado en HTML, CSS y JavaScript Vanilla como proyecto personal de portfolio, partiendo de un prototipo diseñado en Figma para la materia Introducción al Diseño Web (Tecnicatura en Desarrollo Web, UNLaM).

La documentación inicial del proyecto (brief, memoria descriptiva y pantallas) se encuentra en `/docs`.

---

## Funcionalidades

### Diagnóstico inteligente
El usuario describe su problema. El sistema analiza las palabras clave y sugiere indicaciones para solcuionar el problema o profesionale dedicados a eso. Actualmente funciona con lógica predefinida; la integración con un modelo de lenguaje (Gemini) está planificada como próximo paso.

### Registro dual
Flujos de registro diferenciados para usuarios y profesionales, con validaciones en tiempo real y rutas protegidas según el tipo de cuenta.

### Búsqueda filtrada
Listado de profesionales con filtros por rubro (plomería, electricidad, gas, carpintería, albañilería, pinturería) y zona.

### Sistema de turnos
Calendario funcional que respeta la disponibilidad de cada profesional. Bloquea horarios ya reservados, detecta conflictos en la agenda del usuario y diferencia disponibilidad entre días de semana y sábados.

---

## Tecnologías

- HTML5
- CSS3 (con variables CSS y diseño responsive)
- JavaScript Vanilla (ES6+)
- localStorage para persistencia de datos

---

## Persistencia de datos

Los datos se almacenan en el localStorage del navegador.  
Para reiniciar el estado de la aplicación, podés limpiar el localStorage desde las DevTools.

---

## Origen del proyecto

El diseño visual, la identidad de marca y las interfaces fueron desarrollados de forma grupal durante la cursada, aplicando una estética **Neo-Memphis**. El proceso de diseño incluyó brief, memoria descriptiva y prototipado en Figma.

La implementación funcional fue un desafío personal posterior a la entrega académica, desarrollado utilizando a Claude como par de programación.

---


