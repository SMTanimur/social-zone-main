/*** User Update
 * @swagger
 * /user/{username}/edit:
 *  patch:
 *      summary: User id
 *      tags: [User]
 *      parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           description: username
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  firstname:
 *                    type: string
 *                    example: SM
 *                  lastname:
 *                    type: string
 *                    example: Tanimur
 *                  bio:
 *                    type: string
 *                    example: this is me
 *                  gender:
 *                      type: string
 *
 *      responses:
 *          200:
 *              description: Success
 *
 *
 */
