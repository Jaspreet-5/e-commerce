const { rotateTokens } = require('../controllers/token.controller');

const router = require('express').Router();

/**
 * GET /api/auth/t/refresh
 * used to rotate tokens
 */
router.get('/refresh' , rotateTokens)

module.exports = router;