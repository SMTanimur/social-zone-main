import  { isValidObjectId, model, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { EGender, IUser } from "../../@types/user";
import omit from "lodash.omit";
import env from "../../configs/env";
interface IUserModel extends Model<IUser> {
  hashPassword(pw: string): string;
}
const UserSchema = new Schema({
  email: {
      type: String,
      minlength: 12,
      unique: true,
      required: [true, 'Email is required.'],
      lowercase: true,
      maxlength: 64,
      validate: {
          validator: (email) => {
              const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
              return regex.test(email);
          },
          message: '{VALUE} is invalid.'
      }
  },
  password: {
      type: String,
      minlength: 6,
      required: true,
      maxlength: 100
  },
  username: {
      type: String,
      unique: true,
      required: [true, 'Username is required.'],
      lowercase: true,
      minlength: 4,
      maxlength: 30,
      validate: {
          validator: (username) => {
              const regex = /^[a-z]+_?[a-z0-9]{1,}?$/ig;
              return regex.test(username);
          },
          message: 'Username Must preceed with letters followed by _ or numbers eg: john23 | john_23'
      }
  },
  provider_id: {
      type: String,
      default: null
  },
  provider_access_token: String,
  provider_refresh_token: String,
  firstname: {
      type: String,
      maxlength: 40
  },
  lastname: {
      type: String,
      maxlength: 50
  },
  isEmailValidated: {
      type: Boolean,
      default: false
  },
  info: {
      bio: {
          type: String,
          maxlength: 200,
          default: ''
      },
      birthday: {
          type: Date,
      },
      gender: {
          type: String,
          default: 'unspecified',
          enum: ['male', 'female', 'unspecified']
      }
  },
  profilePicture: {
      type: Object, // switched to cloudinary so I have to set as Object
      default: {}
  },
  coverPhoto: {
      type: Object,
      default: {}
  },
  status: {
      type: Number,
      default: 1 // 1 OK | 2 Warning | 3 Blocked | 4 Ban
  },
  dateJoined: {
      type: Date,
      default: Date.now,
      required: true
  }
}, {
  timestamps: true,
  toJSON: {
      virtuals: true,
      transform: function (doc, ret, opt) {
          delete ret.password;
          delete ret.provider_access_token;
          delete ret.provider_refresh_token;
          return ret;
      }
  },
  toObject: {
      getters: true,
      virtuals: true,
      transform: function (doc, ret, opt) {
          delete ret.password;
          delete ret.provider_access_token;
          delete ret.provider_refresh_token;
          return ret;
      }
  }
});

UserSchema.virtual('fullname').get(function () {
  const { firstname, lastname } = this;
  return (firstname && lastname) ? `${this.firstname} ${this.lastname}` : null;
});

// UserSchema.set('toObject', { getters: true });

UserSchema.methods.passwordMatch = function (this: IUser, password, cb) {
  const user = this;

  bcrypt.compare(password, user.password, function (err: any, isMatch: any) {
      if (err) return cb(err);

      cb(null, isMatch);
  });
}

UserSchema.methods.toUserJSON = function () {
  const user = omit(this.toObject(), ['password',  'createdAt', 'updatedAt']);
  return user;
}

UserSchema.methods.toProfileJSON = function (this: IUser) {
  return {
      id: this._id,
      username: this.username,
      fullname: this.fullname,
      profilePicture: this.profilePicture
  };
}

UserSchema.methods.generateVerificationToken = function () {
  const user = this;
  
  const verificationToken = jwt.sign(
      { user_id: user._id },
      env.passport.USER_VERIFICATION_TOKEN,
      { expiresIn: 300000 } // 5 minutes
  );
  return verificationToken;
};


UserSchema.statics.hashPassword = function(pw: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pw, salt);

  return hash;
}

UserSchema.pre('save', function (this: IUser) {
  if (this.info?.gender === null) this.info.gender = EGender.unspecified;
  if (this.firstname === null) this.firstname = '';
  if (this.lastname === null) this.lastname = '';
  if (this.profilePicture === null) this.profilePicture = '';
  if (this.coverPhoto === null) this.coverPhoto = '';
  if (this.info?.birthday === null) this.info.birthday = '';
});

const User = model<IUser, IUserModel>('User', UserSchema);
export default User;

