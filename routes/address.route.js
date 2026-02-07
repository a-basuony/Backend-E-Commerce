const express = require("express");
const {
  addAddress,
  getAddresses,
  removeAddress,
  updateAddress,
} = require("../controllers/address.controller");
const { protected, allowTo } = require("../controllers/auth.controller");
const {
  addAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidators");

const router = express.Router();

router.use(protected, allowTo("user"));

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: User addresses management
 */

/**
 * @swagger
 * /api/v1/addresses:
 *   get:
 *     summary: Get logged user addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *   post:
 *     summary: Add new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *               - details
 *               - phone
 *               - city
 *               - postalCode
 *             properties:
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added successfully
 *       400:
 *         description: Validation error
 */
router.route("/").post(addAddressValidator, addAddress).get(getAddresses);

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   delete:
 *     summary: Remove address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address removed successfully
 *   put:
 *     summary: Update address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router
  .route("/:addressId")
  .delete(removeAddress)
  .put(updateAddressValidator, updateAddress);

module.exports = router;
