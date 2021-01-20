const dbBaseModel = require("../database/dbBaseModel")
const regex = require("../utility/regex")
const bcrypt = require('bcrypt');
const saltRounds = 10; //only for dev change it to higuer value in production

module.exports = class user extends dbBaseModel{
	constructor(databasePool,table){
		super(databasePool,table)
	}

	autenticate(pseudo,password,callback){
		//check if pseudo is pseudo or mail
		if (pseudo.match(regex.mail))
			var field = "mail"
		else 
			var field = "pseudo"

		//verify if ther is any match in db
		this.runQuery(`SELECT * FROM ${this.table} WHERE ${field}=?`,[pseudo],(err,rows)=>{
			if (err)
				console.error(err)
			if (rows[0]){ //if user exist
				var user = rows[0]
				bcrypt.compare(password,user.password,(err,result)=>{ //check password
					if (err){
						console.error(err)
						callback(false,"hash")
					}
					if (result)
						callback(true,"",{pseudo:user.pseudo,permissions:user.permissions,image:user.image,id:user.id})
					else
						callback(false,"password",{})

				})
			} else {
				callback(false,"pseudo",{})
			}
		},true)
	}

	//create new user
	create(pseudo,password,callback) {
		if (!pseudo.match(regex.pseudo))
			callback(false,"pseudo")
		else if (!password.match(regex.password))
			callback(false,"password")

		else//check pseudo
			this.pseudoExist(pseudo,(result,err)=>{
				if (err){
					console.log(err)
					callback(false,"database")
				} else if (result){
					callback(false,"pseudoExist")
				} else
					bcrypt.hash(password,saltRounds,(err,hash)=>{
						if (err){
							console.log(err)
							callback(false,"hash")
						}
						this.runQuery(`INSERT INTO ${this.table} (pseudo,password) VALUES (?,?)`,
									[pseudo,hash],
									(err)=>{
										if (err){
											console.log(err)
											callback(false,"database")
										} else
											callback(true,"")
									})
					})
			})
	}

	//check if user exist
	pseudoExist(pseudo,callback){
		this.runQuery(`SELECT id FROM ${this.table} WHERE pseudo=?`,[pseudo],(err,rows)=>{
			if (err)
				callback(false,"database")
			else if (rows[0])
				callback(true,"")
			else
				callback(false,"")
		},true)
	}

	userInfos(id,pseudo,callback){
		this.runQuery(`SELECT * FROM ${this.table} WHERE id=? AND pseudo=?`,[id,pseudo],(err,rows)=>{
			callback(err,rows[0])
		},true)
	}
}