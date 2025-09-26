'use strict'
const fs = require('fs')

// 1. Leemos los vuelos
const dataSet = JSON.parse(fs.readFileSync("./dataset.json", "utf8"))

// 2. Presupuesto máximo
const PRESUPUESTO = 800

// 3. Agrupamos vuelos por origen
const vuelosPorOrigen = {}
for (let vuelo of dataSet) {
  if (!vuelosPorOrigen[vuelo.origin]) {
    vuelosPorOrigen[vuelo.origin] = []
  }
  vuelosPorOrigen[vuelo.origin].push(vuelo)
}

// 4. Buscamos solo combinaciones ida + vuelta válidas
let opciones = []

for (let ida of dataSet) {
  // buscamos vuelos de regreso desde el destino de la ida
  const regresos = vuelosPorOrigen[ida.destination] || []

  for (let vuelta of regresos) {
    if (vuelta.destination === ida.origin) {
      const total = ida.price + vuelta.price
      if (total <= PRESUPUESTO) {
        opciones.push({
          destino: ida.destination,
          desde: ida.origin,
          precioTotal: total.toFixed(2),
          fechaIda: ida.date,
          fechaVuelta: vuelta.date
        })
      }
    }
  }
}

// 5. Ordenamos por precio
opciones.sort((a, b) => a.precioTotal - b.precioTotal)

// 6. Mostramos resultados
if (opciones.length === 0) {
  console.log("Con $800 no hay opciones de ida y vuelta 😢")
} else {
  console.log("Opciones de vacaciones para Nelsona 🎉")
  opciones.forEach(op => {
    console.log(`
      ✈️ Destino: ${op.destino}
      👉 Desde: ${op.desde}
      📅 Ida: ${new Date(op.fechaIda).toLocaleDateString()}
      📅 Vuelta: ${new Date(op.fechaVuelta).toLocaleDateString()}
      💰 Precio total: $${op.precioTotal}
    `)
  })
}
