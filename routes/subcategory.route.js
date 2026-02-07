const express = require("express");
const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setFilterObject,
  setCategoryIdToBody,
} = require("../controllers/subcategory.controller");
const {
  getSubCategoryValidators,
  updateSubCategoryValidators,
  deleteSubCategoryValidators,
  createSubCategoryValidators,
} = require("../utils/validators/subcategoryValidators");
const { protected, allowTo } = require("../controllers/auth.controller");
// mergeParams: true => /api/v1/categories/:categoryId/subcategories
// getSubCategories => /api/v1/categories/:categoryId/subcategories
// mergeParams: true => allow us to access the params of the parent route
// we need to access categoryId form category router
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: SubCategory management
 */

/**
 * @swagger
 * /api/v1/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of subcategories
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: SubCategory created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route("/").get(setFilterObject, getSubCategories).post(
  protected, // check token
  allowTo("admin", "manager"), // check role
  setCategoryIdToBody,
  createSubCategoryValidators,
  createSubCategory,
);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     responses:
 *       200:
 *         description: SubCategory details
 *       404:
 *         description: SubCategory not found
 *   put:
 *     summary: Update subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: SubCategory updated successfully
 *       404:
 *         description: SubCategory not found
 *   delete:
 *     summary: Delete subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     responses:
 *       204:
 *         description: SubCategory deleted successfully
 *       404:
 *         description: SubCategory not found
 */
router
  .route("/:id")
  .get(getSubCategoryValidators, getSubCategory)
  .put(
    protected, // check token
    allowTo("admin", "manager"), // check role
    updateSubCategoryValidators,
    updateSubCategory,
  )
  .delete(
    protected, // check token
    allowTo("admin"), // check role
    deleteSubCategoryValidators,
    deleteSubCategory,
  );

module.exports = router;
