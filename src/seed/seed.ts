import axios from "axios";
import FormData from "form-data";
import * as fs from "fs";
import * as path from "path";

// Define the product interface (without productImage, as it's handled separately)
interface Product {
	productName: string;
	productDetails: string;
	productPrice: number;
	category: string;
	units: number;
}

// Function to load products from JSON file
function loadProducts(): Product[] {
	const filePath = path.join(__dirname, "products.json");
	const rawData = fs.readFileSync(filePath, "utf8");
	return JSON.parse(rawData);
}

// Function to create a product with image upload
async function createProductWithImage(product: Product, imagePath: string) {
	const formData = new FormData();

	// Append product properties to form data
	formData.append("productName", product.productName);
	formData.append("productDetails", product.productDetails);
	formData.append("productPrice", product.productPrice.toString());
	formData.append("category", JSON.stringify(product.category));

	formData.append("units", product.units.toString());

	// Append the product image
	formData.append("productImage", fs.createReadStream(imagePath));

	// Make the API request
	const response = await axios.post(
		`${process.env.BASE_URL}/vendor/product`,
		formData,
		{
			headers: {
				...formData.getHeaders(),
			},
		},
	);

	return response.data;
}

// Main function to seed the database
async function seedDatabase() {
	try {
		const products = loadProducts();

		for (const product of products) {
			const imagePath = path.join(
				__dirname,
				"images",
				`${product.productName.replace(/\s+/g, "-").toLowerCase()}.jpeg`,
			);

			const response = await createProductWithImage(product, imagePath);
			console.log(
				`Product ${product.productName} created successfully with response:`,
				response,
			);
		}
	} catch (error) {
		console.error("Error seeding the database:", error.message);
	}
}

seedDatabase();
