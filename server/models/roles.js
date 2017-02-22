/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    title: { type: DataTypes.STRING, unique: true, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    write: { type: DataTypes.BOOLEAN, defaultValue: false },
    delete: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    classMethods: {
      associate(models) {
      }
    }
  });
  return Roles;
};
