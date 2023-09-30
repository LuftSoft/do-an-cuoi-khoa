module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('users', {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        avatar: {
            type: DataTypes.BLOB,
        },
        passwordHash: {
            type: DataTypes.STRING(511),
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING(511),
        },
        oauthToken: {
            type: DataTypes.STRING(511),
        },
        resetPasswordToken: {
            type: DataTypes.STRING(511),
        }
    },
        {
            timestamps: false
        }
    );

    return user;
}