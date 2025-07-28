import {Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, AllowNull} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

interface UserAttributes {
    id: number,
    name: string,
    email: string,
    suspendedTIll: Date,
    createdAt: Date,
    updatedAt: Date
}

interface UserCreationAttributes {
    email: string,
    password: string,
    suspendedTIll?: Date,
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;


    @AllowNull(false)
    @Column({ type: DataType.STRING, unique: true })
    email!: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING})
    password!: string;

    @Default(null)
    @AllowNull(true)
    @Column(DataTypes.DATE)
    suspendedTIll?: Date | null
}
