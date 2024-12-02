const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountController = require('../controllers/accountController');
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authenticate');
const savedRecipesController = require('../controllers/savedRecipesController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/account', authenticate, accountController.getUser);
router.patch('/updateData', authenticate, accountController.updateUserData);
router.patch('/updatePass', authenticate, accountController.updateUserPass);
router.post('/logout', authenticate, accountController.logout);
router.delete('/deleteUser', authenticate, accountController.deleteAccount);
router.post('/comment', commentController.createComment);
router.get('/comments', commentController.getAllComments);
router.post('/save-recipe', authenticate, savedRecipesController.saveRecipe);
router.post('/is-saved', authenticate, savedRecipesController.isRecipeSaved);

module.exports = router;
