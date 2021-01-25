const fs   = require("fs")
const https = require("https")


module.exports = class mineceftFilesLoader {
	constructor(){
		this.ops = []
		this.whitelist=[]
	}

	getLog(callback){
		fs.readFile(process.env.MINECRAFT_PATH+"/logs/latest.log",(err,data)=>{
			if (err) throw err

			callback(data.toString())
		})	
	}

	pseudoToUUID(pseudo,callback){
		https.get("https://api.mojang.com/users/profiles/minecraft/"+pseudo,(resp)=>{
			let jsonResponse = ""

			resp.on("data",(data)=>{jsonResponse += data})

			resp.on("end",()=>{
				if (resp.statusCode == 200){
					let jsonResult = JSON.parse(jsonResponse)
					callback(null,jsonResult)
				} else {
					callback("pseudo",null)
				}
			})
		}).on("error",(err)=>{
			callback(err,null)
		})
	}

}