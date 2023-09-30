const permissions = require('../permission');
const role_permissions = require('../role_permissions');
const roles = require('../roles');
const user_roles = require('../user_roles');
const users = require('../users');
const dbconfig = require('./dbconfig');
const config = require('./dbconfig');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,
    {
        host: dbconfig.HOST,
        dialect: dbconfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbconfig.pool.max,
            min: dbconfig.pool.min,
            acquire: dbconfig.pool.acquire,
            idle: dbconfig.pool.idle
        }
    }
)


sequelize.authenticate()
    .then(() => {
        console.info("Connect to database successfully");
    }).catch((err) => {
        console.log('Connect to database failed. Error: ', err);
    })
/* DEFINE  DBCONTEXT */
const dbContext = {}

dbContext.Sequelize = Sequelize
dbContext.sequelize = sequelize

/* DEFINE MODELS */
dbContext.users = require('../users')(sequelize, DataTypes);
dbContext.user_roles = require('../user_roles')(sequelize, DataTypes);
dbContext.roles = require('../roles')(sequelize, DataTypes);
dbContext.role_permissions = require('../role_permissions')(sequelize, DataTypes);
dbContext.permissions = require('../permission')(sequelize, DataTypes);
dbContext.questions = require('../questions')(sequelize, DataTypes);
dbContext.categories = require('../categories')(sequelize, DataTypes);

/* DEFINE RELATIONSHIPS */
users.belongsToMany(roles, { through: user_roles });
roles.belongsToMany(users, { through: user_roles });

roles.belongsToMany(permissions, { through: role_permissions });
permissions.belongsToMany(roles, { through: role_permissions });
// dbContext.sequelize.sync({ force: true })
//     .then(() => {
//         console.log('yes re-sync done!');
//     })

// 1 to Many Relation

// db.products.hasMany(db.reviews, {
//     foreignKey: 'product_id',
//     as: 'review'
// })

// db.reviews.belongsTo(db.products, {
//     foreignKey: 'product_id',
//     as: 'product'
// })


module.exports = dbContext