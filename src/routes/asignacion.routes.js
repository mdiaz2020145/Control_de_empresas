const express = require('express');
const asignacionControlador = require('../controllers/asignacion.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();


module.exports = api;