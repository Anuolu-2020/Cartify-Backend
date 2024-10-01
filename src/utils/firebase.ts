import {
	getDownloadURL,
	ref,
	updateMetadata,
	uploadBytesResumable,
	deleteObject,
} from "firebase/storage";
import bucketStorage from "../config/firebase.config";

//For uploading multiple files
export async function uploadFilesToFirebase(
	file: Express.Multer.File,
): Promise<string> {
	const timestamp = Date.now();
	const name = file.originalname.split(".")[0];
	const type = file.originalname.split(".")[1];
	const fileName = `${name}_${timestamp}.${type}`;

	// Step 1. Create reference for storage and file name in cloud
	const imageRef = ref(bucketStorage, `images/${fileName}`);

	try {
		// Step 2. Upload the file in the bucket storage
		const uploadImage = await uploadBytesResumable(imageRef, file.buffer);

		// Create file metadata.
		const newMetadata = {
			cacheControl: "public,max-age=2629800000",
			contentType: uploadImage.metadata.contentType,
		};

		// Update the metadata for the file.
		await updateMetadata(imageRef, newMetadata);

		//return image URL.
		return await getDownloadURL(imageRef);
	} catch (err) {
		throw new Error(`An Error occurred while uploading: ${err}`);
	}
}

//For deleting multiple images
export async function deleteImagesFromFirebase(fileUrl: string) {
	const fileRef = ref(bucketStorage, fileUrl);

	await deleteObject(fileRef)
		.then(() => {
			console.log("File deleted Successfully");
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}
