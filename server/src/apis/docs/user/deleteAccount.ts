/** Delete Account
 * @swagger
* /user/{id}:
 *  delete:
 *      summary: User delete his account
 *      tags: [User]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *      responses:
 *          200:
 *              description: Success
 * 
 */