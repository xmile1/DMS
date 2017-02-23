module.exports = (sequelize, DataTypes) => {
  const invalidToken = sequelize.define('invalidToken', {
    token: { type: DataTypes.STRING, unique: true }
  }, {
    classMethods: {
      associate(models) {
      }
    }
  });
  return invalidToken;
};
