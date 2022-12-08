/** User Login
 * @swagger
 * /post/create:
 *  post:
 *    summary: Post Create
 *    tags: [Post]
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
