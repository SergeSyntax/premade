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
 * that a User Document has
 */
interface UserDoc extends Document, UserAttrs {}

/**
 * An interface that describes the properties
 * that a User Model has
 */
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema<UserDoc, UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // NOTE: BAD PRACTICE DON'T DO THAT IN PROD APP (VIEW RELATED RESPONSIBILITY)
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

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
