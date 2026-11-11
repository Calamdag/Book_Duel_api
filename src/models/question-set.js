module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      question_set_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      host_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(80), allowNull: false },
      description: { type: DataTypes.STRING(255) },
      subject: { type: DataTypes.STRING(60) },
      grade_level: { type: DataTypes.STRING(30) },
    },
    { tableName: 'question_sets', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );