import sequelize from "../config/database";
import {DataTypes} from "sequelize";

const UserLoginAttempt = sequelize.define('UserLoginAttempts', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    success: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    tableName: 'user_login_attempts',
    timestamps: true
})

export default UserLoginAttempt;