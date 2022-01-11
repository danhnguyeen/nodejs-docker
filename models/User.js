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

// after save
UserSchema.post('save', (error, doc, next) => {
  if (error && error.name === 'MongoServerError' && error.code === 11000) {
    next({ message: 'Email or Username is already exist' });
  } else {
    next(error);
  }
});

// before save
UserSchema.pre(['save', 'update'], async function(next) {
  const user = this;
  if (user.isModified('password')) {
    const hashedPassword = CryptoJS.AES.encrypt(user.password, process.env.CRYPTO_PASSWORD_KEY).toString();
    user.password = hashedPassword;
    next();
  } else {
    next();
  }
  // throw new Error("Error");
})

UserSchema.methods.sayHi = function() {
  console.log("Hi " + this.username);
}

UserSchema.statics.findByName = function (name) {
  // return this.where({name: new RegExp(name, 'i')});
  return this.find({name: new RegExp(name, 'i')});
};

// this function can be exec only on an collection result
UserSchema.query.byName = function (name) {
  // ex: User.find().byName('Danh') => correct
  // User.byName('Danh') => incorrect
  return this.where({name: new RegExp(name, 'i')});
};

UserSchema.virtual('nameEmail').get(function() {
  // only return when we call user.nameEmail
  return `${this.name} ${this.email}`;
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
