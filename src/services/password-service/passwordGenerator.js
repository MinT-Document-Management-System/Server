const crypto = require('crypto')
const bcrypt = require('bcrypt')

 function generate_temp_password(length){
    return crypto.randomBytes(length).toString('hex').slice(0, length);
 }

 async function hash_password(password) {
    const saltRounds = 10
    const hashed_pass = await bcrypt.hash(passw, saltRounds)
    return hashed_pass
 }

 module.exports = { generate_temp_password, hash_password}
