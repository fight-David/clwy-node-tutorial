'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '标题必须存在'
        },
        notEmpty: {
          msg: '标题不能为空'
        },
        len: {
          args: [2, 45],
          msg: '标题长度必须在2到45个字符之间'
        }
      }
    },
    content: DataTypes.TEXT,
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    paranoid: true, // 软删除
    modelName: 'Article',
  });
  return Article;
};