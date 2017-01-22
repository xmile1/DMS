import faker from 'faker';

module.exports = {
  user: {
    username: faker.internet.userName(),
    fullNames: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    RoleId: 1
  }
};
