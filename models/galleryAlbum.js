export default (sequelize, DataTypes) => {
  return sequelize.define('GalleryAlbum', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    cover_image: { type: DataTypes.STRING },
  }, {
    tableName: 'gallery_albums',
    underscored: true,
    timestamps: true,
  });
};
