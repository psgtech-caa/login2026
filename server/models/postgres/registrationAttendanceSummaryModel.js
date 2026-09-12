const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");

const registrationAttendanceSummaryModel = sequelize.define(
  "registration_attendance_summary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    total_registered_events: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    total_present_events: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    overall_attendance_percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    overall_status: {
      type: DataTypes.ENUM("excellent", "good", "fair", "low", "not_marked"),
      allowNull: false,
      defaultValue: "not_marked",
    },

    last_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "registration_attendance_summary",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id"],
      },
    ],
  }
);

module.exports = registrationAttendanceSummaryModel;
