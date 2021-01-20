var express = require("express")
var userModel = require("../database/userModel")
const {csrfToken,csrfParse} = require("../middlewares/csrfToken")


module.exports = db => {

	var router = express.Router();

	router.userModel = new userModel(db,"users")
	

	router.post("/signin",csrfParse,(req,res)=>{
		const body = req.body

		if (!req.validToken)
			res.json({result:false,err:"token"})
		else if (body.pseudo != undefined && body.password != undefined)
			router.userModel.autenticate(req.body.pseudo,req.body.password,(result,err,user)=>{
				if (result){
					req.session.userId = user.id
					req.session.pseudo = user.pseudo
					req.session.permission = user.permission
					res.json({result:true,err:""})
				} else {
					res.json({result:false,err:err})
				}
			})
		else{
			res.json({result:false,err:"input"})
		}
	})


	router.post("/signup",csrfParse,(req,res)=>{
		const body = req.body
		const redirect = req.query.noJavascript

		if (!req.validToken)
			res.json({result:false,err:"token"})

		else if (body.pseudo != undefined && body.password != undefined && body.passwordRepeat != undefined){
			if (body.password != body.passwordRepeat)
				res.json({result:false,err:"passwordRepeat"})

			else
				router.userModel.create(body.pseudo,body.password,(result,err)=>{
					res.json({result:result,err:err})
				})
		} else 
			res.json({result:false,err:"input"})
	})

	router.post("/userExist",(req,res)=>{
		const body = req.body
		if (body.pseudo)
			router.userModel.pseudoExist(body.mail,(result,err)=>{
				res.json({result:result,err:err})
			})
		else {
			res.json({result:false,err:"input"})
		}
	})

	//disconnect route
	router.get("/disconnect",(req,res)=>{
		req.session.destroy(err => {
		  	console.error("error append when destroy session:")
		  	console.error(err)
		  	res.redirect("/")
		})
	})

	//accout route
	router.get("/account",csrfToken,(req,res)=>{
		if (req.connected){
			router.userModel.userInfos(req.session.userId,req.session.pseudo,(err,row)=>{
				if (err){
					console.log(err)
					res.redirect("/")
				} else if (row == undefined) {
					res.redirect("/user/disconnect")
				} else {
					res.render("pages/userAccount.ejs",{pseudo:row.pseudo,image:row.image})
				}
			})
			
		} else {
			res.redirect("/")
		}
	})

	return router
}