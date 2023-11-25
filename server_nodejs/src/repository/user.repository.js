const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const users = dbContext.users;

module.exports = {
  create: async (user) => {
    user.id = Helpers.generateUiid(8);
    user.age = 1;
    const userCreate = await users.create(user);
    return userCreate;
  },
  update: async (user) => {
    let isExists = await users.findByPk(user.id);
    if (isExists) isExists = user;
    await isExists.save();
    return isExists;
  },
  delete: async (id) => {
    const result = await users.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
  getById: async (id) => {
    const user = await users.findByPk(id);
    return user;
  },
  getByEmail: async (email) => {
    const query = `SELECT * 
        FROM users as u
        WHERE u.email = '${email}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user[0];
  },
  getRoles: async (id) => {
    const query = `SELECT 
        r.id,
        r.name
        FROM users as u
        JOIN user_roles as ur ON u.id = ur.user_id
        JOIN roles as r ON ur.role_id = r.id
        WHERE u.id = '${id}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user;
  },
  getPemissions: async (role_id) => {
    const query = `SELECT 
        p.name
        FROM roles as r 
        JOIN role_permissions as rp ON r.id = rp.role_id
        JOIN permissions as p ON rp.permission_id = p.id
        WHERE r.id = '${role_id}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user;
  },
  getAll: async () => {
    const listUser = await users.findAll();
    return listUser;
  },
  getByType: async (type) => {
    const listUser = await users.findAll({
      where: { type: type.toUpperCase() },
    });
    return listUser;
  },
};
