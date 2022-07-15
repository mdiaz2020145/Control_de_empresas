// importaciones
const express = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//Regristrar Empresa
function registrarEmpresa(req,res){
    var parametros = req.body;
    var usuarioModel = new Usuario;

    if(parametros.nombre && parametros.email && parametros.password){
        usuarioModel.nombre = parametros.nombre;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'ROL_EMPRESA';
        
            Usuario.find({ email : parametros.email }, (err, EmpresaEncontrada) => {
                if ( EmpresaEncontrada.length == 0 ) {

                    bcrypt.hash(parametros.password,null,null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, EmpresaGuardada) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if(!EmpresaGuardada) return res.status(500).send({ mensaje: 'Error al agregar la empresa'});                            
                            return res.status(200).send({ usuario: EmpresaGuardada });
                        });
                    });                    
                } else {
                    return res.status(500).send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}

//Regristrar Admin
function registrarAdmin(req, res) {
    //var parametros = req.body;
    var usuarioModelo = new Usuario();    
        usuarioModelo.nombres = 'ADMIN';
        usuarioModelo.email = 'ADMIN';
        usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    
    Usuario.find({ email: 'ADMIN', nombres: 'ADMIN'}, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456",null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                })
            })
        } else {
            console.log('El usuario admin ya esta creado')
        }
    })
}

//Editar empresa
function EditarEmpresa(req,res){
    var idUser = req.params.idUsuario;
    var paramentros = req.body;
    Usuario.findByIdAndUpdate({_id: idUser,email: paramentros.email,password: paramentros.password,rol: paramentros.rol,},
        paramentros,{ new: true },(err, empresaEditada) => {
          if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!empresaEditada)return res.status(400).send({ mensaje: "No se puede ediar la empresa" });
          return res.status(200).send({ usuarios: empresaEditada });
        }
      );
    }

//Eliminar Empresa
function eliminarEmpresa(req,res){
    var idUser = req.params.idUsuario;
    Usuario.findByIdAndDelete(idUser,(err,empresaEliminada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la empresa'});

        return res.status(200).send({ Empresa: empresaEliminada});
    })
}

//LOGIN 
function login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

module.exports ={
    registrarEmpresa,
    registrarAdmin,
    login,
    EditarEmpresa,
    eliminarEmpresa
}