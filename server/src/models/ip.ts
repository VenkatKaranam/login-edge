import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, AllowNull } from 'sequelize-typescript';

interface ipAttributes {
    id: number,
    ipAddress: string,
    blockedTill?: Date,
    createdAt: Date,
    updatedAt: Date
}

interface ipCreationAttributes {
    id: number,
    ipAddress: string,
    blockedTill?: Date,
}

@Table({ tableName: 'ips' })
export default class Ip extends Model<ipAttributes, ipCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Unique
    @Column(DataType.STRING)
    ipAddress!: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    blockedTill?: Date;
}