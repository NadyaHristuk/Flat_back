const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const  { Conflict, Unauthorized  }  = require("http-errors");

const { SECRET_KEY } = process.env;

require("dotenv").config();

const signup = async(req, res, next) => {
  try {    
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Conflict(`Email ${email} in use`);
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({ email, password: hashPassword, balance });

        res.status(201).json({
          success: true,
          message: "Successfully created new user. You can Login",
          user: { id: String(result._id),
          name,
          email}       
        });

  } catch (error) {
    next(error);
  }
};

// Login User and get him Token for access to some route action
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passCompare = await bcrypt.compareSync(password, user.password);
    if (!user || passCompare) {
      throw new Unauthorized('Email or password is wrong');
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
      
      return res.json({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          subscription: user.subscription,
        }
      });
  } catch (error) {
    next(error);
  }
};

// Logout User
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" }, { new: true });

  res.status(204).send();
}

module.exports.userInfo = async (req, res) => {
  const _id = req.user;
  const user = await User.findById(_id, {
    createdAt: 0,
    updatedAt: 0,
    password: 0,
  })
    .populate("ownNotices", { title: 1, description: 1 })
    .populate("userPets", { owner: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .populate("favoriteNotices", { title: 1, description: 1 });
  res.status(200).json(user);
};

module.exports = {signup, login, logout};