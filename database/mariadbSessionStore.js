const session = require ("express-session")
const dbBaseModel = require("../database/dbBaseModel")
const mixer = require("ts-mixer")

module.exports = class mariadbStore extends mixer.Mixin(session.Store,dbBaseModel){
	constructor(databasePool,table){
		super(databasePool,table)
	}

	all(callback){
		this.runQuery(`SELECT * FROM ${this.table}`,[],callback,true)
	}

	destroy(sid,callback){
		this.runQuery(`DELETE FROM ${this.table} WHERE sid=?`,[sid],callback)
	}

	clear(callback){
		this.runQuery(`DELETE FROM ${this.table}`,[],callback)
	}

	length(callback){
		this.runQuery(`SELECT count(*) FROM ${this.table}`,[],callback,true,0)
	}

	get(sid,callback){
		this.runQuery(`SELECT session FROM ${this.table} WHERE sid=?`,[sid],(err,result)=>{
			if (err)
				callback(err)
			else
			{
				if (result == undefined){
					return callback(null,null)
				} else {
					callback(null,JSON.parse(result.session))
				}
				
			}
		},true,0)
	}

	set(sid,session,callback){
		this.get(sid,(err,getSession) => {
			if (err)
				callback(err)
			else if (getSession){
				this.touch(sid,session,callback)
			} else {
				this.runQuery(`INSERT INTO ${this.table} (sid,session) VALUES (?,?)`,[sid,JSON.stringify(session)],callback)
			}
		})
	}

	touch(sid,session,callback){
		this.runQuery(`UPDATE ${this.table} SET session=? WHERE sid=?`,[JSON.stringify(session),sid],callback)
	}
}