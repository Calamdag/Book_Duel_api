module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Session',
    {
      session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      host_id: { type: DataTypes.INTEGER, allowNull: false },
      question_set_id: { type: DataTypes.INTEGER, allowNull: false },
      join_code: { type: DataTypes.CHAR(6), allowNull: false, unique: true },
      status: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'waiting' },
      end_reason: { type: DataTypes.STRING(25) },
      started_at: { type: DataTypes.DATE },
      ended_at: { type: DataTypes.DATE },
    },
    { tableName: 'sessions', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );