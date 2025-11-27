export default (sequelize, DataTypes) => {
  return sequelize.define('GalleryPhoto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    album_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
    uploaded_by: { type: DataTypes.STRING },
  }, {
    tableName: 'gallery_photos',
    underscored: true,
    timestamps: true,
  });
};
