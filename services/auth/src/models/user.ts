import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserAttrs>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: {
      transform(_doc, ret, _options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        delete ret.password;
      },
    },
  },
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password'))
    this.set('password', await Password.toHash(this.get('password')));

  done();
});

const User = mongoose.model('User', userSchema);

export { User };
