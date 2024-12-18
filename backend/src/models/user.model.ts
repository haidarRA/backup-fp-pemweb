import mongoose from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

type TokenType = {
  token: string;
};

export type UserType = {
  username: string;
  password: string;
  role: Role;
  tokens: TokenType[];
};

const UserSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.USER,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("Users", UserSchema);
