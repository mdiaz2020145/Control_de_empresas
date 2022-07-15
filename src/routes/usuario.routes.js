const express = require('express');
const usuarioControlador = require('../controllers/usuario.controllers'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();
api.post('/registrarEmpresa', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador] , usuarioControlador.registrarEmpresa);
api.post('/registrarAdmin', usuarioControlador.registrarAdmin);
api.post('/login',usuarioControlador.login);
api.put('/editarEmpresa/:idUsuario',[md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], usuarioControlador.EditarEmpresa);
api.delete('/eliminarEmpresa/:idUsuario',[md_autenticacion.Auth, md_autenticacion_roles.verAdministrador],usuarioControlador.eliminarEmpresa);
module.exports = api;