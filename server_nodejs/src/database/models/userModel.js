module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('users', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        avatar: {
            type: DataTypes.BLOB,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        oauthToken: {
            type: DataTypes.STRING,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
        }
    },
        {
            timestamps: false
        }
    );

    return user;
}