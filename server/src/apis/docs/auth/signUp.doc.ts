/** Register
 * @swagger
 * /auth/sign-up:
 *  post:
 *    summary: User Register
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *    responses:
 *       200:
 *         description: Success
 *
 */
