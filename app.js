const express = require("express");
const app = express();
const Sequelizer = require("sequelize");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 3000;

const db = new Sequelizer("node_sequelize", "root", "password", {
  host: "localhost",
  dialect: "mysql"
});

db.authenticate()
  .then(result => {
    console.log("DB connected...");
  })
  .catch(err => {
    console.log(err);
    console.error("DB connection failed...");
  });

const User = db.define(
  "user",
  {
    name: {
      type: Sequelizer.STRING,
      allowNull: false
    },
    email: {
      type: Sequelizer.STRING,
      isEmail: true,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelizer.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false,
    hooks: {
      beforeValidate: function() {
        console.log("Before Validation");
      },
      beforeCreate: function() {
        console.log("Before Creating");
      },
      afterCreate: function(user) {
        console.log(user.dataValues);
      },
      afterValidate: async function(user) {
        console.log("After Validation");
        const salt = await bcrypt.genSaltSync(5);
        console.log(salt);
        user.password = await bcrypt.hashSync(user.password, salt);
        console.log(user.password);
      }
    }
  }
);

db.sync({
  force: true,
  logging: console.log
})
  .then(() => {
    User.create({
      name: "Arbaz Chughtai",
      email: "arbazchughtai55@gmail.com",
      password: "arbaz"
    });
  })
  .catch(err => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Listening to localhost:${port}`);
});
