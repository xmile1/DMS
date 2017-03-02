module.exports = (sequelize, DataTypes) => {
  const InvalidTokens = sequelize.define('InvalidTokens', {
    token: { type: DataTypes.STRING, unique: true }
  });
  return InvalidTokens;
};
