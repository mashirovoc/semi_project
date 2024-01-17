const { Router } = require('express');

const controllerUser = require('../controllers/UserControllers');
const controllerPost = require('../controllers/PostControllers');
const JWTController = require('../controllers/JWTControllers');

const loginValidator = require('../validators/loginValidator');
const registerValidator = require('../validators/registerValidator');
const searchValidator = require('../validators/searchValidator');
const updateProfileValidator = require('../validators/updateProfileValidator');
const postValidator = require('../validators/postValidator');

const router = Router();

router.post('/register', registerValidator, controllerUser.userRegister);
router.post('/login', loginValidator, controllerUser.userLogin);

router.get('/refresh', JWTController.grantNewAccessToken);
router.get('/logout', JWTController.userLogout);

router.get('/user/:username', controllerUser.getProfileByUsername);
router.get('/search/user', searchValidator, controllerUser.getMatchedUsersProfile);

router.get('/me', JWTController.verifyAccessToken, controllerUser.getMyProfile);
router.patch('/me', JWTController.verifyAccessToken, updateProfileValidator, controllerUser.editMyProfile);
router.delete('/me', JWTController.verifyAccessToken, controllerUser.deleteMyAccount);

router.get('/p/user/:username', controllerPost.getPostByUsername);
router.get('/p/all', controllerPost.getAllPost);
router.get('/search', searchValidator, controllerPost.getSearchPost);

router.post('/p/create', JWTController.verifyAccessToken, postValidator, controllerPost.createPost);

module.exports = router;
