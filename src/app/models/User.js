const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, dataTypes) =>{
    const User = sequelize.define('User', {
        name: dataTypes.STRING,
        email: dataTypes.STRING,
        password: dataTypes.VIRTUAL,
        password_hash: dataTypes.STRING
    },{
        hooks: {
            beforeSave: async user=>{
                if(user.password){
                    user.password_hash = await bcrypt.hash(user.password, 8)
                }
            }
        }
    })

    User.prototype.checkPassword = function(password){
        return bcrypt.compare(password, this.password_hash)
    }

    User.prototype.generateToken = function(){
        return jwt.sign({id: this.id}, process.env.APP_SECRET)
    }
    return User
}