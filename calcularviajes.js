'use strict'
const fs = require('fs')

const dataSet = JSON.parse(fs.readFileSync("./dataset.json", "utf8"))

const PRESUPUESTO = 800

const vuelosPorOrigen = {}
for (let vuelo of dataSet) {
  if (!vuelosPorOrigen[vuelo.origin]) {
    vuelosPorOrigen[vuelo.origin] = []
  }
  vuelosPorOrigen[vuelo.origin].push(vuelo)
}

let opciones = []

for (let ida of dataSet) {

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

opciones.sort((a, b) => a.precioTotal - b.precioTotal)

// 6. Mostramos resultados
if (opciones.length === 0) {
  console.log("Con $800 no hay opciones de ida y vuelta")
} else {
  console.log("Opciones de vacaciones")
  opciones.forEach(op => {
    console.log(`
    Destino: ${op.destino}
    Desde: ${op.desde}
    Ida: ${new Date(op.fechaIda).toLocaleDateString()}
    Vuelta: ${new Date(op.fechaVuelta).toLocaleDateString()}
    Precio total: $${op.precioTotal}
    `)
  })
}
