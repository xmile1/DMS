/* eslint-disable max-len */
import bcrypt from 'bcrypt-nodejs';
import { Logger } from 'logger';
import db from '../../models';

/**
 * Helper Class to prepopulate the test database
 */
class SeedHelper {

  /**
   * Populate database with priority based on associations
   * @return {void} - Returns void
   */
  static init() {
    db.sequelize.sync({ force: true })
    .then(() => {
      SeedHelper.initialRoles()
      .then(() => { SeedHelper.initialUsers(); })
      .then(() => { SeedHelper.initialDocuments(); })
      .catch((err) => {
        Logger.error(err);
      });
    });
  }

  /**
   * Populates db with default roles
   * @returns {object} - A Promise object
   */
  static initialRoles() {
    const roles = [
      {
        title: 'Admin',
        read: true,
        write: true,
        delete: true
      },
      {
        title: 'Regular',
        read: true,
        write: false,
        delete: true
      },
    ];
    return db.Roles.bulkCreate(roles);
  }

  /**
   * Populates db with default documents
   * @returns {object} - A Promise object
   */
  static initialDocuments() {
    const documents = [
      {
        title: 'Special Unusual',
        content: 'this is a test document and it contains unique content so that when i search specifically for a document with the word specialunusual i will find it',
        permission: 'public',
        OwnerId: '1'
      },
      {
        title: 'Special Unusual 2',
        content: 'this is a another test document and it contains unique content but also the word specialunusual so that my test search return 2 results on search for special',
        permission: 'public',
        OwnerId: '1'
      },
      {
        title: 'Something Different',
        content: 'this is a another test document and it contains unique content but also the word specialunusual so that my test search return 2 results on search for special',
        permission: 'public',
        OwnerId: '2'
      }
    ];
    return db.Documents.bulkCreate(documents);
  }

  /**
   * Populates db with default users
   * @returns {object} - A Promise object
   */
  static initialUsers() {
    const users = [
      {
        username: 'uyiosa',
        email: 'uyiosa@uyi.com',
        password: SeedHelper.hashPass('uyiosa'),
        fullNames: 'Uyiosa Enabulele',
        RoleId: 1
      },
      {
        username: 'uyiosa2',
        email: 'uyiosa2@uyi.com',
        password: SeedHelper.hashPass('uyiosa2'),
        fullNames: 'Uyiosa2 Enabulele',
        RoleId: 2
      }
    ];
    return db.Users.bulkCreate(users);
  }

  /**
   * hashPass - Hashes the password before adding to the database
   * @param {string} password password to be hashed.
   * @returns {string} Hashed password
   */
  static hashPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
  }
}

export default SeedHelper.init();
