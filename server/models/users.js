import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    username: {
      unique: true,
      type: DataTypes.STRING
    },
    fullNames: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    RoleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: (models) => {
        // // associations defined here
        // User.belongsTo(models.Role, {
        //   onDelete: 'CASCADE',
        //   foreignKey: { allowNull: false }
        // });
        // User.hasMany(models.Document, { foreignKey: 'OwnerId' });
      }
    },
    instanceMethods: {
      /**
       * Compare plain password to user's hashed password
       * @method
       * @param {String} password
       * @returns {Boolean} password match
       */
      validPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },

      /**
       * Hash user's password
       * @method
       * @returns {Void} no return
       */
      hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
      }
    },

    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },

      beforeUpdate(user) {
        if (user._changed.password) {
          user.hashPassword();
        }
      }
    }
  });
  return User;
};
