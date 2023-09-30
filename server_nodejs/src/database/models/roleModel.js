module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('roles', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        normalizeName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    });
    return role;
}