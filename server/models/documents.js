module.exports = (sequelize, DataTypes) => {
  const Documents = sequelize.define('Documents', {
    title: { type: DataTypes.STRING, allowNull: false },
    content: DataTypes.TEXT,
    permission: { type: DataTypes.TEXT, defaultValue: 'Public' },
    OwnerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate(models) {
        Documents.belongsTo(models.Users, {
          onDelete: 'cascade',
          foreignKey: 'OwnerId'
        });
      }
    }
  });
  return Documents;
};
