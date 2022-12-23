/** Post update
 * @swagger
 * /post/{postId}:
 *   patch:
 *    summary: Post update
 *    tags: [Post]
 *    parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *            type: string
 *            description: post id
 *    requestBody:
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 description :
 *                   type: string
 *                   example: this is new post
 *    responses:
 *       200:
 *         description: Success
 */
