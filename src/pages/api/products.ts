import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/dbConnect';
import { IProduct, Product } from '../../../models/product'; // Adjusted the path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                if (id) {
                    // Fetch a single product by its _id
                    const product: IProduct | null = await Product.findById(id);
                    if (!product) {
                        return res.status(404).json({ error: 'Product not found' });
                    }
                    return res.status(200).json(product);
                } else {
                    // Fetch all products
                    const products: IProduct[] = await Product.find();
                    return res.status(200).json(products);
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error fetching products' });
            }

        case 'POST':
            try {
                const product = new Product(req.body);
                await product.save();
                return res.status(201).json(product);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error creating product' });
            }

        case 'PUT':
            try {
                const { ...rest } = req.body;
                const updatedProduct = await Product.findByIdAndUpdate(id, rest, { new: true });
                if (!updatedProduct) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                return res.status(200).json(updatedProduct);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error updating product' });
            }

        case 'DELETE':
            try {
                await Product.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Product deleted successfully' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error deleting product' });
            }

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}
