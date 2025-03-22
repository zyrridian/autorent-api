/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - brand
 *         - model
 *         - year
 *         - pricePerDay
 *       properties:
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: integer
 *         pricePerDay:
 *           type: integer
 *
 * paths:
 *   /api/cars:
 *     post:
 *       summary: Add a new car
 *       tags: [Cars]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       responses:
 *         201:
 *           description: Car added successfully
 *         400:
 *           description: Validation error
 *
 *     get:
 *       summary: Get all cars
 *       tags: [Cars]
 *       responses:
 *         200:
 *           description: List of cars
 *
 *   /api/cars/{id}:
 *     put:
 *       summary: Update car details
 *       tags: [Cars]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       responses:
 *         200:
 *           description: Car updated successfully
 *         400:
 *           description: Validation error
 *
 *     delete:
 *       summary: Delete a car
 *       tags: [Cars]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Car deleted successfully
 *         400:
 *           description: Car not found
 */
