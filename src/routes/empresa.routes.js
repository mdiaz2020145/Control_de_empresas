const express = require('express');
const empresaControlador = require('../controllers/empresa.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.post('/agregarEmpleado',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.agregarEmpleado);
api.put('/editarEmpleado/:idEmpleado',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.editarEmpleado);
api.delete('/eliminarEmpleado/:idEmpleado',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.eliminarEmpleado);
api.get('/buscarEmpleadoPorID/:idEmpleado',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.obtenerEmpleadoPorId);
api.get('/buscarEmpleadoPorNombre/:nombre',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.obtenerEmpleadoPorNombre);
api.get('/buscarEmpleadoPorPuesto/:puesto',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.obtenerEmpleadoPorPuesto);
api.get('/buscarEmpleadoPorDepartamento/:departamento',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.obtenerEmpleadoPorDepartamento);
api.get('/buscarEmpleado/',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.obtenerEmpleado);
api.get('/contarEmpleados',[md_autenticacion.Auth, md_autenticacion_roles.VerEmpresa],empresaControlador.contarEmpleados);

//PDF
api.get('/generarPdf',md_autenticacion.Auth,empresaControlador.crearPDF);
module.exports = api;