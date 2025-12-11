#!/bin/bash

# Script de inicialización para MongoDB

mongosh --authenticationDatabase admin --username admin --password admin123 <<EOF

// Conectar a la base de datos
use jhenson

// Crear índices si es necesario
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ brand: 1 })
db.products.createIndex({ category: 1 })

db.orders.createIndex({ orderId: 1 }, { unique: true })
db.orders.createIndex({ buyerId: 1 })
db.orders.createIndex({ sellerId: 1 })
db.orders.createIndex({ date: 1 })

db.clients.createIndex({ email: 1 }, { unique: true })
db.clients.createIndex({ phone: 1 })

db.storages.createIndex({ name: 1 }, { unique: true })

db.paymentHistory.createIndex({ orderId: 1 })
db.paymentHistory.createIndex({ clientId: 1 })

db.images.createIndex({ url: 1 })

console.log("✅ Índices creados exitosamente en la base de datos 'jhenson'")

EOF
