import { Request, Response } from "express";

/**
 * @swagger
 * /api/v{version}:
 *   get:
 *     summary: Welcome to Cartify API
 *     tags: [Welcome]
 *     description: This route provides a welcome message for the Cartify API.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: version
 *         schema:
 *           type: string
 *         required: true
 *         description: The API version
 *     responses:
 *       200:
 *         description: A successful response with a welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: welcome to Cartify Api v1
 *       404:
 *         description: Undefined API version accessed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Undefined API version accessed.
 *                 success:
 *                   type: boolean
 *                   example: false
 */
export const welcomeToApi = (req: Request, res: Response) => {
	const { version } = req.params;

	res.status(200).json({
		status: "success",
		message: `welcome to Cartify Api v${version}`,
	});
};
