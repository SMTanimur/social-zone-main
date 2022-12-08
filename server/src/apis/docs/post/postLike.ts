/**Post like or unlike
 * @swagger
 *  /post/{id}/like:
 *    post:
 *      summary: Post Like Request
 *      tags: [Post]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *           type: string
 *           description: exact post id
 *      responses:
 *              200:
 *               description: successfully like
 */