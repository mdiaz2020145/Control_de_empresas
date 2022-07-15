//Importaciones
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const empleado = require('../models/empleado.models');
const Usuario = require('../models/usuario.model');



function crearPDF(req,res){
    empleado.find({idEmpresa:req.user.sub},(err,empleadoEncontradoPDF)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});

        const fs = require('fs');
        const pdfmake = require('pdfmake');

        var fonts ={
            Roboto:{
                normal:'./fonts/Roboto/Roboto-Regular.ttf',
                bold: './fonts/Roboto/Roboto-Medium.ttf',
                italics: './fonts/Robot/Roboto-Italic.ttf',
                bolditalics: './fonts/Roboto/Roboto-MediumItalic.ttf'
            }

        };

        let pdf = new pdfmake(fonts);

        let content =[{
            text: 'Listado de empleados',fontsize:35, alignment:'center'
        }]

        for(let i =0; i< empleadoEncontradoPDF.length;i++){

            let datos = i + 1;

            content.push({
                text:'  ',
            })


            content.push({
                text:'Empleado:'+'  '+''+datos,
            })

            content.push({
                text:'Empleado :'+' '+empleadoEncontradoPDF[i].nombre,
            })

            content.push({
                text:'puesto :'+''+empleadoEncontradoPDF[i].puesto,
            })

            content.push({
                text:'Departamento :'+''+empleadoEncontradoPDF[i].departamento,
            })

        }

        let docDefinition ={
            content : content,
        }

        let pdfDocumento = pdf.createPdfKitDocument(docDefinition,{});
        pdfDocumento.pipe(fs.createWriteStream('reporte.pdf'));
        pdfDocumento.end();
        return res.status(200).send({mensaje:'El pdf esta creado'});

    })

}


function agregarEmpleado(req, res) {
    var parametros = req.body;
    var empleadoModel = new empleado();

    if (parametros.nombre,parametros.puesto,parametros.departamento) {
        empleadoModel.nombre = parametros.nombre;
        empleadoModel.puesto = parametros.puesto;
        empleadoModel.departamento = parametros.departamento;
        empleadoModel.idEmpresa = req.user.sub; 
    } else {
        return res.status(500).send({ message: "error" })
    }

    empleado.find({ nombre: parametros.nombre,puesto:parametros.puesto,departamento:parametros.departamento,idEmpresa:req.user.sub}, (err, empleadoGuardado) => {
        if (empleadoGuardado.length==0) {
            empleadoModel.save((err, empleadosGuardados) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!empleadosGuardados) return res.status(404).send({ message: "No se puede agregar un empleado" });
                return res.status(200).send({ empleado: empleadosGuardados  });
            });
            
        } else {
            return res.status(500).send({ message: 'este empleado ya existe' });
        }
    })
}

function editarEmpleado(req,res){
    var idEmp = req.params.idEmpleado; 
    var paramentros = req.body; 
    empleado.findOneAndUpdate({_id:idEmp, idEmpresa:req.user.sub},paramentros,{new:true},(err,empleadoEditado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEditado) return res.status(400).send({mensaje: 'No se puede editar el empleado'});
        return res.status(200).send({empleado: empleadoEditado});
    })
}

function eliminarEmpleado(req,res){
    var idEmp = req.params.idEmpleado; 
    empleado.findOneAndDelete({_id:idEmp, idEmpresa:req.user.sub},(err,empleadoEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el empleado'});
        return res.status(200).send({empleado: empleadoEliminado});

    })
}


//Funciones de buscar Empleados 

//Obtener empleado por id 
function obtenerEmpleadoPorId(req,res){
    var idEmp = req.params.idEmpleado; 

    empleado.findById(idEmp,(err,empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error al obtener los datos'});
        return res.send({empleado: empleadoEncontrado});
    })
}

//Obtener empleado por nombre 
function obtenerEmpleadoPorNombre(req,res){
    var nombreEmp = req.params.nombre;

    empleado.find({ idEmpresa: req.user.sub,nombre: {$regex:nombreEmp,$options:'i'}},(err, empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error al obtener los datos'});
        return res.send({empleado: empleadoEncontrado});
    })

}

//Obtener empleado por puesto
function obtenerEmpleadoPorPuesto(req,res){
    var puestoEmp = req.params.puesto;

    empleado.find({ idEmpresa: req.user.sub,puesto: {$regex: puestoEmp,$options:'i'}},(err,empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error al obtener los datos'});
        return res.send({empleado: empleadoEncontrado});
    })
}

//Obtener empleado por departamento
function obtenerEmpleadoPorDepartamento(req,res){
    var departamentoEmp = req.params.departamento; 

    empleado.find({ idEmpresa: req.user.sub,departamento:{$regex: departamentoEmp,$options:'i'}},(err,empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error al obtener los datos'});
        return res.send({empleado: empleadoEncontrado});
    })
}


//Obtener todos los empleados
function obtenerEmpleado(req,res){
    empleado.find({ idEmpresa: req.user.sub },(err,empleadoEncontrado)=>{
        for(let i =0;i<empleadoEncontrado.length;i++){
            console.log(empleadoEncontrado[i].nombre)
        }
        return res.send({ empleado: empleadoEncontrado })
    })
    
}

//Obtener todos los empleados de una empresa
/*function obtenerEmpleadoIDEmpresa(req,res){
    var idEmpresa = req.params.idUsuario; 

    empleado.find({empleado:{$regex: idEmpresa, $options:'i'}},(err,empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error al obtener los datos'});
        return res.send({empleado: empleadoEncontrado});


    })

}*/

//Obtener todos los empleados
function contarEmpleados(req, res) {
    empleado.count({ idEmpresa: req.user.sub},(err, empleadoEncontrado) => {
        for (let i = 0; i < empleadoEncontrado.length; i++) {
            console.log(empleadoEncontrado[i].nombre)
        }
        return res.send({ empleado: empleadoEncontrado })
    })

}


module.exports = {
    agregarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    obtenerEmpleadoPorId,
    obtenerEmpleadoPorNombre,
    obtenerEmpleadoPorPuesto,
    obtenerEmpleadoPorDepartamento,
    obtenerEmpleado,
    contarEmpleados,
    crearPDF
}