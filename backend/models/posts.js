'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Posts.init({
    post_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
      field: 'user_id',
      onDelete: 'cascade',
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Posts',
  });

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      foreignKey: 'user_id',
    });
  };

  return Posts;
};