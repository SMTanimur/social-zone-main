/**Upload Image
 * @swagger
 * /upload/{field}:
 *    post:
 *      summary: Image upload
 *      tags: [Upload]
 *      parameters:
 *        - in: path
 *          name: field
 *          required: true
 *          schema:
 *           type: string
 *           description: exact 
 *      requestBody:
 *        content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *      responses:
 *              200:
 *               description: successfully uploaded
 */