/**Get User
 * @swagger
* /user/{username}:
 *  get:
 *      summary: User find by username
 *      tags: [User]
 *      parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           description: User  username
 *      responses:
 *          200:
 *              description: Success
 * 
 */