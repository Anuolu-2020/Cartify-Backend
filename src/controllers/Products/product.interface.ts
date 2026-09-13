interface IPhotoAsset {
	url: string;
	public_id: string;
}

interface Iproducts {
	photo: string[];
	photoAssets?: IPhotoAsset[];
}

interface IDeleteResult {
	deletedCount: number;
}

export { Iproducts, IDeleteResult };
