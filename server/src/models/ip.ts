import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'ips' })
export default class Ip extends Model<Ip> {
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