export default (sequelize, DataTypes) => {
  return sequelize.define('Blog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT },
    author: { type: DataTypes.STRING },
    tags: { type: DataTypes.JSON },
    cover_image: { type: DataTypes.STRING },
    seo_title: { type: DataTypes.STRING },
    seo_description: { type: DataTypes.STRING },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'blogs',
    underscored: true,
    timestamps: true,
  });
};
