/** Get followers
 * @swagger
 *  /{username}/followers:
 *    get:
 *      summary: Get User followers
 *      tags: [Follow]
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          schema:
 *           type: string
 *           description: exact username
 *      responses:
 *              200:
 *               description: success
 */