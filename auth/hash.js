const crypto = require('crypto');

function EncryptPassword(password, optionalSalt){
    /*
      *The optional salt arguments is used when a user with an account wants to be authenticated
      *It is gotten from the database
      */
    this.salt = crypto.randomBytes(16).toString('hex'); //Generate a salt
    //if optional salt is not provided, use the generated salt
    this.hash = crypto.pbkdf2Sync(password, optionalSalt || this.salt, 1000, 64, `sha512`).toString(`hex`);//hash the password
    return {
        salt: optionalSalt || this.salt,
        hash: this.hash
    };
}

module.exports = (pass, optionalSalt) => new EncryptPassword(pass, optionalSalt);


