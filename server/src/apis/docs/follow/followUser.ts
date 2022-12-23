/** Follow user
 * @swagger
 *  /follow/{follow_id}:
 *    post:
 *      summary: Post Like Request
 *      tags: [Follow]
 *      parameters:
 *        - in: path
 *          name: follow_id
 *          required: true
 *          schema:
 *           type: string
 *           description: exact userId
 *      responses:
 *              200:
 *               description: successfully followed
 */