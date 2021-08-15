import { Document, Model, model, Schema } from 'mongoose';
import { Password } from '../services/password';

/**
 * An interface that describers the properties
 * that are required to create a new User
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a User Model has
 */
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properties
 * that a User Document has
 */
interface UserDoc extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (done) {
  if (this.isModified('password'))
    this.set('password', await Password.toHash(this.get('password')));

  done();
});

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };
