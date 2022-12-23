/** Get following
 * @swagger
 *  /{username}/following:
 *    get:
 *      summary: Get User following
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