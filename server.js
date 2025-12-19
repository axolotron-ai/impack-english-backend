import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { ComponentLoader } from 'adminjs';
import { Adapter, Resource, Database } from '@adminjs/sql';
import uploadFeature from '@adminjs/upload';

import fs from 'fs';
import path from 'path';
// import { componentLoader } from './utils/componentLoader.js';


import galleryRoutes from './routes/gallery.js';
import blogRoutes from './routes/blog.js';
import ctaRoutes from './routes/cta.js';
import { features } from 'process';

dotenv.config();

// other imports

const componentLoader = new ComponentLoader();

const galleryUploadFeature = uploadFeature({
  componentLoader,
  provider: {
    local: {
      bucket: path.join(process.cwd(), "uploads"),
    },
  },

  properties: {
    key: "image_url",   // 👈 ONLY this column will be saved
  },

  uploadPath: (record, filename) => {
    return `gallery/${Date.now()}-${filename}`;
  },
  validation:  {
  mimeTypes: ["image/png", "image/jpeg"],
  maxSize: 5 * 1024 * 1024, // 5MB
}
});



// Register the Sequelize adapter for AdminJS
AdminJS.registerAdapter({
  Database: Database,
  Resource: Resource,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => res.send("OK"));

app.use("/uploads", express.static("uploads"));


// Simple session middleware for AdminJS auth
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'change-me',
		resave: false,
		saveUninitialized: true,
	})
);


// Build connection string from environment variables (prefer DATABASE_URL if present)
const connectionString =
	process.env.DATABASE_URL ;

  console.log('Using DB connection string:', connectionString);
const db = await new Adapter('postgresql', {
	connectionString,
	database: process.env.PG_DATABASE || undefined,
  ssl: false
  // {
  //   ca: fs.readFileSync("./certs/ca.crt").toString(),
  //   rejectUnauthorized: true
  // }
}).init();

// Ensure uploads dir exists for local provider
try {
  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads', 'gallery');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads dir ready at', uploadsDir);
} catch (err) {
  console.warn('Could not create uploads directory:', err.message);
}




// AdminJS setup
const admin = new AdminJS({
  componentLoader,
	resources: [
    { 
      resource: db.table('blogs'),
      options: {
        listProperties: ["id", "title", "content", "author","slug" , "published", "created_at"],
        editProperties: [ "title", "content", "author","slug" , "tags", "published", "created_at"],
        showProperties: ["id", "title", "content", "author","slug" , "tags", "published", "created_at"],
        filterProperties: ["title", "tags"],
        sort: { sortBy: "created_at", direction: "desc" },
        navigation: { name: 'Content Management', icon: 'Home' },
        properties: {
          content: { type: 'richtext' },
          published: { type: 'boolean' },
          updated_at:{ isVisible: false },
        },
      },
    },
    {
      resource: db.table('gallery_albums'),
      options: {
        navigation: { name: 'Image Management', icon: 'Image' },
        properties: {
          id: { isVisible: false },
          name: { isTitle: true },
        },
      },
    },
    {
      resource: db.table('gallery_photos'),
      options: {
        navigation: { name: 'Image Management', icon: 'Image' },
        properties: {
          id: { isVisible: false },
          album_id: {
            type: "reference",
            reference: "gallery_albums", // 👈 relational field
            isRequired: true,
          },
          image_url: {
            // type:"string",
            isVisible: { list: true, edit: false, show: false, filter: false },
          },
        },
      },
      actions: {
      new: {
        before: async (request) => {
          if (request.payload && !request.payload.image_url) {
            request.payload.image_url = '/images/default-image.png';
          }
          return request;
        },
      },

      
    },
      features:[
        galleryUploadFeature
      ]
      // features: [
      //   uploadFeature({
      //     componentLoader,
      //     provider: {
      //       local: {
      //         // Use configurable uploads dir (defaults to ./uploads/gallery for dev).
      //         bucket: process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads', 'gallery'),
      //       },
      //     },
      //     properties: {
      //       key: 'image_url',   // DB column
      //       file: 'uploadImage'
      //     },
      //     uploadPath: (record, filename) => {
      //       const ext = path.extname(filename);
      //       return `photos/${record.id || 'new'}-${Date.now()}${ext}`;
      //     },
      //     validation: {
      //       mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      //       maxSize: 3 * 1024 * 1024,
      //     },
      //   }),
      // ],
    },
    {
      resource: db.table('cta_buttons'),
      options: {
        listProperties: ["id", "button_name", "button_link", "is_active", "created_at"],
        editProperties: ["button_name", "button_link", "is_active"],
        showProperties: ["id", "button_name", "button_link", "is_active", "created_at", "updated_at"],
        filterProperties: ["button_name", "is_active"],
        sort: { sortBy: "created_at", direction: "desc" },
        navigation: { name: 'CTA Management', icon: 'Link' },
        properties: {
          button_name: { 
            isTitle: true,
            isRequired: true,
          },
          button_link: { 
            isRequired: true,
          },
          is_active: { 
            type: 'boolean',
            availableValues: [
              { value: true, label: 'Active' },
              { value: false, label: 'Inactive' }
            ]
          },
          updated_at: { isVisible: { list: false, edit: false, filter: false } },
        },
      },
    },
	],
	rootPath: '/admin',
});

admin.watch();



const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate: async (email, password) => {
			if (email === ADMIN_USER && password === ADMIN_PASS) return { email: ADMIN_USER };
			return null;
		},
		cookiePassword: process.env.SESSION_SECRET || 'change-me',
	},
	null,
	{
		resave: false,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET || 'change-me',
	}
);
app.use(admin.options.rootPath, adminRouter);

// Routes
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/cta', ctaRoutes);

const PORT = process.env.PORT;

// Initialize DB (authenticate) and start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// connectAndSync({ sync: false })
// 	.then(() => {
// 	})
// 	.catch((err) => {
// 		console.error('Failed to initialize database for AdminJS:', err);
// 		// Still start server so API routes using pool can work; AdminJS will error until DB is available
// 		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (DB connection failed)`));
// 	});
