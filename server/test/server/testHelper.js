import faker from 'faker';

module.exports = {
  user: () => ({
    username: faker.internet.userName(),
    fullNames: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    RoleId: 2 }),
  userFullNames: () => ({
    fullNames: `${faker.name.firstName()} ${faker.name.lastName()}`,
  }),
  admin: () => ({
    username: faker.internet.userName(),
    fullNames: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    RoleId: 1
  }),
  noRoleUser: () => ({
    username: faker.internet.userName(),
    fullNames: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),
  document: () => ({
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
    permission: 'Public',
    OwnerId: 1
  }),
  documentNoPermission: () => ({
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
    OwnerId: 1
  }),
  documentWithArg: (permission, OwnerId) => ({
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
    permission,
    OwnerId
  }),
  defaultRole: () => ({
    title: faker.lorem.word(),
    read: true,
    write: false,
    delete: false
  }),
};
