/**Get Posts for timeline
 * @swagger
 *  /post/timeline:
 *    get:
 *     summary: get all post for timeline
 *     tags: [Post]
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: number
 *        - in: query
 *          name: userId
 *          schema:
 *            type: string
 *     responses:
 *             200:
 *              description: success
 * 
 */