// Backend/Router/toolRoute.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  AddTool,
  addTool,
  categoryPagination,
  findToolByUser,
  pagination,
  Search,
  submitTool,
  suggestions,
} from '../Controller/toolController.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();

// Ensure /tmp directory exists
const ensureTmpDir = () => {
  const tmpDir = '/tmp';
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  } catch (err) {
    console.error('Error ensuring /tmp directory:', err);
  }
};

// Configure Multer to use /tmp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureTmpDir();
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/add', upload.single('file'), addTool);
router.post('/addtool', isAuthenticated, AddTool);
router.post('/submit/:id', isAuthenticated, submitTool);
router.get('/tool-by-user', isAuthenticated, findToolByUser);
router.get('/search', Search);
router.get('/pagination', pagination);
router.get('/category', categoryPagination);
router.get('/suggestions', suggestions);

export default router;