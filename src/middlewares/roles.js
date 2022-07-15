exports.verAdministrador = function(req, res,next){
    if(req.user.rol !== "ROL_ADMINISTRADOR") return res.status(403).send({mesnaje:"Solo puede acceder el Administrador"})

    next();
}

exports.VerEmpresa = function(req, res, next){
    if(req.user.rol !== "ROL_EMPRESA") return res.status(403).send({mesnaje:"Solo puede acceder a la empresa"})

    next();
}