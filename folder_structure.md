# Project Folder Structure

```
d:/backend Projects/E Commerce backend
├── config/
│   ├── cloudinary.js       # Centralized Cloudinary configuration
│   └── ...
├── controllers/
│   ├── handlersFactory.js  # Generic CRUD handlers (uses cloudinaryService)
│   ├── product.controller.js # Product logic (uses cloudinaryService)
│   └── ...
├── middlewares/
│   ├── resizeImageMiddleware.js # Resizes images & uploads to Cloudinary via Service
│   ├── uploadImageMiddleware.js # Multer config (MemoryStorage, Limits)
│   └── ...
├── models/
│   ├── product.model.js    # Mongoose model
│   └── ...
├── services/
│   └── cloudinaryService.js # [NEW] Service layer for all Cloudinary interactions
├── utils/
│   └── apiError.js         # Error handling class
├── .env                    # Environment variables (gitignored)
├── .env.example            # Template for env vars
├── server.js               # App entry point
└── package.json
```

## Key Changes

- **services/cloudinaryService.js**: Central hub for upload/delete logic.
- **middlewares/resizeImageMiddleware.js**: Now uses `cloudinaryService` directly, skipping local disk save.
- **controllers**: Updated to handle memory buffers and use the service layer.
