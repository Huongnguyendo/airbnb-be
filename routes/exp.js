var express = require('express');
var router = express.Router();
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const expController = require("../controllers/experience.controllers")
/* GET users listing. */
router.get('/', expController.getExp);

router.post('/add', authMiddleware.loginRequired, expController.createExp);

router.get(
    "/:id",
    validators.validate([
      param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    expController.getSingleExp
  );

router.put(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    // body("title", "Missing title").exists().notEmpty(),
    // body("content", "Missing content").exists().notEmpty(),
  ]),
  expController.updateSingleExp
);

/**
 * @route DELETE api/blogs/:id
 * @description Delete an exp
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  expController.deleteSingleExp
);

  

module.exports = router;