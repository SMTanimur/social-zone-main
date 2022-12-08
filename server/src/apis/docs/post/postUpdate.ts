/** Post update
 * @swagger
 * /post/{id}:
 *   patch:
 *    summary: Post update
 *    tags: [Post]
 *    parameters:
 *       - in: path
 *         name: id
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
 *                 desc :
 *                   type: string
 *                   example: this is new post
 *                 author :
 *                    type: string
 *    responses:
 *       200:
 *         description: Success
 */
