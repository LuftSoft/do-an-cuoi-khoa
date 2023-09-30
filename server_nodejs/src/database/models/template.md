```
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        'users', 
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false /*option create date, updated date*/
        } 
    );

    return user;
}
```

# relationship
## many-to-many relationship
```
- User.belongsToMany(Profile, {through: 'User_Profile'});
- Profile.belongsToMany(User, {through: 'User_Profile'});
```
