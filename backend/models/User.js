import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleID: { type: String },
    profileImage: { type: String },
    birthdate: { type: Date },
  },
  {
    timestamps: true,
    collection: 'utenti',
  }
);

const User = mongoose.model('User', userSchema);
export default User;
