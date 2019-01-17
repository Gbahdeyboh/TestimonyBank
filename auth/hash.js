const crypto = require('crypto');

function EncryptPassword(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return {
        salt: this.salt,
        hash: this.hash
    };
}

module.exports = (pass) => new EncryptPassword(pass);


