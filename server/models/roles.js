module.exports = function (sequelize, DataTypes) {
  const Roles = sequelize.define('Roles', {
    title: { type: DataTypes.STRING, unique: true, allowNull: false },
    read: DataTypes.BOOLEAN,
    write: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      }
    }
  });
  return Roles;
};
