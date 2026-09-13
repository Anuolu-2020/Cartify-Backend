import cloudinary from "../config/cloudinary.config";

export interface CloudinaryAsset {
	url: string;
	public_id: string;
}

export async function uploadFileToCloudinary(
	file: Express.Multer.File,
): Promise<CloudinaryAsset> {
	const sanitized = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");
	const timestamp = Date.now();
	const publicId = `cartify/products/${sanitized}_${timestamp}`;

	const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

	try {
		const result = await cloudinary.uploader.upload(dataUri, {
			public_id: publicId,
			resource_type: "image",
			overwrite: false,
			transformation: [
				{ width: 800, crop: "limit" },
				{ quality: "auto", fetch_format: "auto" },
			],
		});

		return { url: result.secure_url, public_id: result.public_id };
	} catch (err: any) {
		throw new Error(`An Error occurred while uploading to Cloudinary: ${err.message || err}`);
	}
}

export async function uploadFromUrlToCloudinary(
	imageUrl: string,
	publicIdHint: string,
): Promise<CloudinaryAsset> {
	try {
		const result = await cloudinary.uploader.upload(imageUrl, {
			public_id: `cartify/products/migrated/${publicIdHint}`,
			resource_type: "image",
			overwrite: false,
			transformation: [
				{ width: 800, crop: "limit" },
				{ quality: "auto", fetch_format: "auto" },
			],
		});
		return { url: result.secure_url, public_id: result.public_id };
	} catch (err: any) {
		throw new Error(`Cloudinary fetch upload failed for ${imageUrl}: ${err.message || err}`);
	}
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
	try {
		await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
	} catch (err: any) {
		console.error(`Failed to delete ${publicId}:`, err.message || err);
		throw err;
	}
}

export function extractPublicIdFromUrl(url: string): string | null {
	// Cloudinary URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/.../public_id.ext
	try {
		const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?(?:\?.*)?$/);
		if (match && match[1]) return match[1];
		return null;
	} catch {
		return null;
	}
}
