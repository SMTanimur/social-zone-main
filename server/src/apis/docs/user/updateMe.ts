/*** User Update
 * @swagger
 * /user/{id}:
 *  post:
 *      summary: User id
 *      tags: [User]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    example: tanimur
  *                  city:
 *                    type: string
 *                    example: Dhaka
 *                  from:
 *                    type: string
 *                    example: Dhaka
 *                  profilePicture:
 *                      type: string
 *                  coverPicture:
 *                      type: string
 *                     
 *      responses:
 *          200:
 *              description: Success
 *
 *
 */
