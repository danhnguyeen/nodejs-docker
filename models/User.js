const mongoose = require("mongoose");
var CryptoJS = require("crypto-js");
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

UserSchema.post('save', (error, doc, next) => {
  if (error && error.name === 'MongoServerError' && error.code === 11000) {
    next({ message: 'Email or Username is already exist' });
  } else {
    next(error);
  }
});

UserSchema.pre(['save', 'update'], async function(next) {
  const user = this;
  if (user.isModified('password')) {
    const hashedPassword = CryptoJS.AES.encrypt(user.password, process.env.CRYPTO_PASSWORD_KEY).toString();
    user.password = hashedPassword;
    next();
  } else {
    next();
  }
})

UserSchema.statics.findByCredenticals = function (email, password) {
  const User = this;
  return new Promise((resolve, reject) => {
    User.findOne({ email }).then(async (doc) => {
      if (!doc) {
        return reject(new Error('The email is incorrect'));
      }
      const hashedPassword  = CryptoJS.AES.decrypt(doc.password, process.env.CRYPTO_PASSWORD_KEY);
      var originalPass = hashedPassword.toString(CryptoJS.enc.Utf8); 
      if (originalPass != password) {
        return reject(new Error('The password is incorrect'));
      }
      resolve(doc);
    }).catch(err => reject(err));
  });
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
