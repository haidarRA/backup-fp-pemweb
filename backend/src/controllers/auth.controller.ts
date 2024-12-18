import { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { HashPassword } from "../services/auth.service";
import bcrypt from "bcrypt";

// Catatan: Untuk register hanya untuk penambahan data dummy/placeholder saja.
export const Register = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    var { username, password, role } = user;

    const isUsernameAlreadyExist = await User.findOne({
      username: username,
    });
    if (isUsernameAlreadyExist) {
      res.status(400).json({
        status: "error",
        message: "User already registered",
      });
      return;
    }

    if (role != "ADMIN" && role != "USER") {
        res.status(400).json({
          status: "error",
          message: "Invalid role",
        });
        return;
    }

    password = await HashPassword(password);

    const newUser = await User.create({
      username,
      password,
      role,
    });

    res.status(201).json({ 
      status: "success",
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "error",
      message: error.message.toString(),
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    var { username, password } = user;

    const isUserAlreadyExist = await User.findOne({
      username: username,
    });
    if (!isUserAlreadyExist) {
      res.status(400).json({
        status: "error",
        message: "User not registered",
      });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserAlreadyExist.password
    );
    if (!isPasswordMatched) {
      res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
      return;
    }
    const token = jwt.sign(
      { _id: isUserAlreadyExist?._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    isUserAlreadyExist.tokens.push({ token });
    await isUserAlreadyExist.save();

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: {
        user: {
          username: isUserAlreadyExist.username,
          role: isUserAlreadyExist.role
        },
        token: token
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "error",
      message: error.message.toString(),
    });
  }
};

export const getUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Token not provided",
      });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.SECRET_KEY as string);

    if (!decoded || !decoded._id) {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
      return;
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Username retrieved successfully",
      data: {
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: error.message || "An unexpected error occurred",
    });
  }
};