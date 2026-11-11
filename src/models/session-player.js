module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'SessionPlayer',
    {
      session_player_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING(20), allowNull: false },
      hp: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 5 },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_eliminated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_winner: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: 'session_players', timestamps: true, createdAt: 'joined_at', updatedAt: false }
  );