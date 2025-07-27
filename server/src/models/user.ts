import sequelize from "../config/database";
import {DataTypes} from "sequelize";

const User= sequelize.define('User', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    suspendedTill : {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'users'
});

export default User;