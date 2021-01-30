const express = require("express")
const {csrfToken,csrfParse} = require("../middlewares/csrfToken")


module.exports = (fileManager) => {
	var router = express.Router()


	router.post("/add/:name/:pseudo",csrfParse,(req,res)=>{
		if (req.connected)
			fileManager.addConfigListElement(req.params.name,req.params.pseudo,(err)=>{
				res.json({err:err})
			})
		else
			res.redirect("/")
	})

	router.post("/del/:name/:pseudo",csrfParse,(req,res)=>{
		if (req.connected)
			fileManager.deleteConfigListElement(req.params.name,req.params.pseudo,(err)=>{
				res.json({err:err})
			})
		else
			res.redirect("/")
	})

	router.get("/get/:name/",(req,res)=>{
		fileManager.getConfigList(req.params.name,(err,jsonList)=>{
			res.json({err:err,list:jsonList})
		})
	})

	router.get("/property",(req,res)=>{
		fileManager.getServerProperty((err,result)=>{
			if (err)
				res.json({err:err})
			else
				res.json({err:err,property:result})
		})
	})

	router.post("/property",csrfParse,(req,res)=>{

	})

	return router
}
