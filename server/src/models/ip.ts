import sequelize from "../config/database";
import {DataTypes} from "sequelize";

const Ip= sequelize.define('Ip', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ipAddress: {
        type: DataTypes.STRING,
        unique: true
    },

    blockedTill : {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'ips'
});

export default Ip;