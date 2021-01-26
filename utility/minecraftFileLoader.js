const fs   = require("fs")
const https = require("https")


module.exports = class mineceftFilesLoader {
	constructor(){
		this.jsonConfigFiles = {
			"ops":{
				file:"ops.json",
				list:[]
			},
			"whitelist":{
				file:"whitelist.json",
				list:[]
			},
			"banned-players":{
				file:"banned-players.json",
				list:[]
			}
		}
	}

	getLog(callback){
		fs.readFile(process.env.MINECRAFT_PATH+"/logs/latest.log",(err,data)=>{
			if (err) throw err

			callback(data.toString())
		})	
	}

	getConfigList(name,callback){
		if (this.jsonConfigFiles[name]){
			this.readConfigList(name,(err)=>{
				callback(err,this.jsonConfigFiles[name].list)
			})
		} else {
			callback("not found")
		}
	}

	deleteConfigListElement(name,pseudo,callback){
		this.readConfigList(name,(err)=>{
			if (err)
				callback({err:err})
			else {
				for (var i = 0; i<this.jsonConfigFiles[name].list.length; i++) {
					if (this.jsonConfigFiles[name].list[i].name == pseudo){
						this.jsonConfigFiles[name].list.splice(i, 1)
						i--
					}
				}
				this.writeConfigList(name,callback)
			}
		})
	}

	addConfigListElement(name,pseudo,callback){
		if (this.jsonConfigFiles[name])
			this.readConfigList(name,(err)=>{
				if (err)
					callback(err)
				else
					this.pseudoToUUID(pseudo,(err,result)=>{
						if (err){
							callback(err)
						}
						else {
							this.jsonConfigFiles[name].list.push({
								"uuid":result.id,
								"name":result.name,
								"level":2
							})
							this.writeConfigList(name,callback)
						}
					})
			})
		else
			callback("not found")
	}

	readConfigList(name,callback){
		fs.readFile(process.env.MINECRAFT_PATH+"/"+this.jsonConfigFiles[name].file,(err,data)=>{
			if (err){
				console.log("File reading error :",err)
				callback(err)
			} else {
				this.jsonConfigFiles[name].list = JSON.parse(data.toString())

				callback()
			}
		})	
	}

	writeConfigList(name,callback){
		fs.writeFile(process.env.MINECRAFT_PATH+"/"+this.jsonConfigFiles[name].file,JSON.stringify(this.jsonConfigFiles[name].list),(err)=>{
			if (err){
				console.log("File writing error :",err)
				callback(err)
			} else {
				callback()
			}
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
					callback("pseudo")
				}
			})
		}).on("error",(err)=>{
			callback(err)
		})
	}
}