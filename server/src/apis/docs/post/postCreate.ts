/** User Login
 * @swagger
 * /post:
 *  post:
 *    summary: Post Create
 *    tags: [Post]
 *    requestBody:
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: this is new post
 *                 privacy:
 *                   type: string
 *                   example: public
 *    responses:
 *       200:
 *         description: Success
 */
