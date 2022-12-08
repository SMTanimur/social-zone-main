/** User Login
 * @swagger
 * /auth/sign-in:
 *  post:
 *    summary: User Login
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: smtrstar@gmail.com
 *                 password:
 *                   type: string
 *                   example: 123456
 *    responses:
 *       200:
 *         description: Success
 */
