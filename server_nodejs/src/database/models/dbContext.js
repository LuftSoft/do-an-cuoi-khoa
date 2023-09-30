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
    })
    .catch((err) => {
        console.log('Connect to database failed. Error: ', err);
    })

const dbContext = {}

dbContext.Sequelize = Sequelize
dbContext.sequelize = sequelize

dbContext.users = require('./userModel')(sequelize, DataTypes);
dbContext.roles = require('./roleModel')(sequelize, DataTypes);
dbContext.userRoles = require('./userRoleModel')(sequelize, DataTypes);
dbContext.questions = require('./questions')(sequelize, DataTypes);

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