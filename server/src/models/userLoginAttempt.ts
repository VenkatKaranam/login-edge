import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';
import Ip from "./ip";
import {User} from "./user";

interface UserLoginAttemptAttributes {
    id: number;
    userId?: number;
    ipId: number;
    success: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface UserLoginAttemptCreationAttributes{
    userId?: number;
    ipId: number;
    success: boolean;
}

@Table({
  tableName: 'user_login_attempts',
  timestamps: true
})
class UserLoginAttempt extends Model<UserLoginAttemptAttributes, UserLoginAttemptCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  userId?: number;

  @ForeignKey(() => Ip)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  ipId!: number;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  success!: boolean;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Ip)
  ip!: Ip;
}

export default UserLoginAttempt;