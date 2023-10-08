const permissions = require('../permissions');
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
dbContext.permissions = require('../permissions')(sequelize, DataTypes);
dbContext.questions = require('../questions')(sequelize, DataTypes);
dbContext.tests = require('../tests')(sequelize, DataTypes);
dbContext.subjects = require('../subjects')(sequelize, DataTypes);
dbContext.chapters = require('../chapters')(sequelize, DataTypes);
dbContext.credit_classes = require('../credit_classes')(sequelize, DataTypes);
dbContext.groups = require('../groups')(sequelize, DataTypes);
dbContext.semesters = require('../semesters')(sequelize, DataTypes);
dbContext.test_schedules = require('../test_schedules')(sequelize, DataTypes);
dbContext.results = require('../results')(sequelize, DataTypes);
dbContext.test_details = require('../test_details')(sequelize, DataTypes);
dbContext.group_details = require('../group_details')(sequelize, DataTypes);

module.exports = dbContext;