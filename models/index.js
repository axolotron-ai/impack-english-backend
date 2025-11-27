import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import BlogModel from './blog.js';
import GalleryAlbumModel from './galleryAlbum.js';
import GalleryPhotoModel from './galleryPhoto.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
    logging: false,
    define: {
      underscored: true,
      freezeTableName: false,
    },
  }
);

const Blog = BlogModel(sequelize, DataTypes);
const GalleryAlbum = GalleryAlbumModel(sequelize, DataTypes);
const GalleryPhoto = GalleryPhotoModel(sequelize, DataTypes);

// Associations
GalleryAlbum.hasMany(GalleryPhoto, { foreignKey: 'album_id', as: 'photos' });
GalleryPhoto.belongsTo(GalleryAlbum, { foreignKey: 'album_id', as: 'album' });

const connectAndSync = async (opts = { sync: false }) => {
  await sequelize.authenticate();
  if (opts.sync) {
    await sequelize.sync({ alter: true });
  }
  return sequelize;
};

export { sequelize, Blog, GalleryAlbum, GalleryPhoto, connectAndSync };
