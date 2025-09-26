"use strict";

const PRESUPUESTO = 800;

fetch("./dataset.json")
  .then(res => res.json())
  .then(dataSet => {
    const vuelosPorOrigen = {};
    for (let vuelo of dataSet) {
      if (!vuelosPorOrigen[vuelo.origin]) {
        vuelosPorOrigen[vuelo.origin] = [];
      }
      vuelosPorOrigen[vuelo.origin].push(vuelo);
    }

    let opciones = [];

    for (let ida of dataSet) {
      const regresos = vuelosPorOrigen[ida.destination] || [];

      for (let vuelta of regresos) {
        if (vuelta.destination === ida.origin) {
          const total = ida.price + vuelta.price;
          if (total <= PRESUPUESTO) {
            opciones.push({
              destino: ida.destination,
              desde: ida.origin,
              precioTotal: total.toFixed(2),
              fechaIda: ida.date,
              fechaVuelta: vuelta.date,
            });
          }
        }
      }
    }

    opciones.sort((a, b) => a.precioTotal - b.precioTotal);

    const contenedor = document.getElementById("resultados");

    if (opciones.length === 0) {
      contenedor.innerHTML = `<p>No hay opciones de ida y vuelta por menos de $${PRESUPUESTO}</p>`;
    } else {
      opciones.forEach(op => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${op.destino}</h2>
          <p><strong>Desde:</strong> ${op.desde}</p>
          <p><strong>Ida:</strong> ${new Date(op.fechaIda).toLocaleDateString()}</p>
          <p><strong>Vuelta:</strong> ${new Date(op.fechaVuelta).toLocaleDateString()}</p>
          <p class="precio">Precio total: $${op.precioTotal}</p>
        `;
        contenedor.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error("Error cargando dataset.json:", err);
  });
