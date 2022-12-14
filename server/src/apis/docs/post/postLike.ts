/**Post like or unlike
 * @swagger
 *  /post/like/{postId}:
 *    post:
 *      summary: Post Like Request
 *      tags: [Post]
 *      parameters:
 *        - in: path
 *          name: postId
 *          required: true
 *          schema:
 *           type: string
 *           description: exact post id
 *      responses:
 *              200:
 *               description: successfully like
 */