'use strict';
const bcrypt = require('bcrypt');
const moment = require('moment');

require('dotenv').config();

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

  }
  Users.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        max: 15,
        min: 1,
        is: /^[a-zA-Z0-9_]{1,15}$/,
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    bio: DataTypes.TEXT,
    birthdate: {
      type: DataTypes.DATEONLY,
    }
  }, {
    sequelize,
    modelName: 'Users',

  });


  Users.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  Users.prototype.checkPassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };


  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      foreignKey: { field: "user_id" },
      onDelete: 'CASCADE',
    });
  };

  return Users;
};
