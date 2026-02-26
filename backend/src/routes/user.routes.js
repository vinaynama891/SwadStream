const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/save-reel/:reelId', authMiddleware.authUserMiddleware, userController.saveReel);
router.delete('/save-reel/:reelId', authMiddleware.authUserMiddleware, userController.unsaveReel);
router.post('/like-reel/:reelId', authMiddleware.authUserMiddleware, userController.likeReel);
router.delete('/like-reel/:reelId', authMiddleware.authUserMiddleware, userController.unlikeReel);
router.get('/saved-reels', authMiddleware.authUserMiddleware, userController.getSavedReels);
router.get('/liked-reels', authMiddleware.authUserMiddleware, userController.getLikedReels);
router.get('/orders', authMiddleware.authUserMiddleware, userController.getPastOrders);
router.get('/saved-liked-ids', authMiddleware.authUserMiddleware, userController.getSavedAndLikedIds);
router.post('/comment/:reelId', authMiddleware.authUserMiddleware, userController.addComment);
router.get('/comments/:reelId', authMiddleware.authUserMiddleware, userController.getComments);
router.delete('/comment/:reelId/:commentId',authMiddleware.authUserMiddleware,userController.deleteComment
);

module.exports = router;