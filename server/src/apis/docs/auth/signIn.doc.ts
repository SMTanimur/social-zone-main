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
 *                 username:
 *                   type: string
 *                   example: tanimur
 *                 password:
 *                   type: string
 *                   example: 123456
 *    responses:
 *       200:
 *         description: Success
 */
