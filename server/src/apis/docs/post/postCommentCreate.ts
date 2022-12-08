/**Post comment create
 * @swagger
 *   /post/{id}:
 *     post:
 *       summary: New comment create on post
 *       tags: [Post]
 *       parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *       requestBody:
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     body:
 *                       type: string
 *                       example: this is comment
 *       responses:
 *              201:
 *                description: success
 * 
 * 
 * 
 */