//Importaciones
const express = require('express');
const cors = require('cors');


var app = express();

//Importaciones Rutas
const UsuarioRutas = require('./src/routes/usuario.routes');
const EmpresaRutas = require('./src/routes/empresa.routes');

//Middlewares -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras
app.use(cors());

//CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api',UsuarioRutas,EmpresaRutas);

module.exports = app;