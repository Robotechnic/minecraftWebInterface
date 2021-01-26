const express = require("express")


module.exports = (fileManager) => {
	var router = express.Router()


	router.get("/add/:name/:pseudo",(req,res)=>{
		fileManager.addConfigListElement(req.params.name,req.params.pseudo,(err)=>{
			res.json({err:err|null})
		})
	})

	router.get("/del/:name/:pseudo",(req,res)=>{
		fileManager.deleteConfigListElement(req.params.name,req.params.pseudo,(err)=>{
			res.json({err:err|null})
		})
	})

	router.get("/get/:name/",(req,res)=>{
		fileManager.getConfigList(req.params.name,(err,jsonList)=>{
			res.json({err:err|null,list:jsonList})
		})
	})

	return router
}
