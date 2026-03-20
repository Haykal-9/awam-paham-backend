const express = require('express');
const multer = require('multer');
const { analyzeReport } = require('../controllers/analyzeController');

const router = express.Router();

// Memory limits (10MB max)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', upload.single('document'), analyzeReport);

module.exports = router;
