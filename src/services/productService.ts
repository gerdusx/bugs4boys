import axios from 'axios';
import { IProduct } from '../../models/product'; // Adjusted the path

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type ProductCreateRequest = {
    name: string;
}

// Read: Get all products
export const getProducts = async (): Promise<IProduct[]> => {
    return (await axios.get(`${apiUrl}/api/products`)).data;
};

// Read: Get a single product by its ID
export const getProduct = async (id: string): Promise<IProduct> => {
    return (await axios.get(`${apiUrl}/api/products?id=${id}`)).data;
};

// Create: Add a new product
export const createProduct = async (product: ProductCreateRequest): Promise<IProduct> => {
    return (await axios.post(`${apiUrl}/api/products`, product)).data;
};

// Update: Edit an existing product
export const updateProduct = async (id: string, product: ProductCreateRequest): Promise<IProduct> => {
    return (await axios.put(`${apiUrl}/api/products?id=${id}`, product)).data;
};

// Delete: Remove a product
export const deleteProduct = async (id: string): Promise<void> => {
    await axios.delete(`${apiUrl}/api/products?id=${id}`);
};
