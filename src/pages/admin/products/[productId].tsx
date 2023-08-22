import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { IProduct } from '../../../../models/product';
import { Formik } from 'formik';
import { ProductCreateRequest, getProduct, updateProduct } from '@/services/productService';
import * as yup from "yup";

export default function EditProduct() {
    const router = useRouter();
    const { productId } = router.query;

    const [product, setProduct] = useState<IProduct | null>(null);
    const [initialValues, setInitialValues] = useState<ProductCreateRequest>({
        name: "",
    });

    const checkoutSchema = yup.object().shape({
        name: yup.string().required("This field is required"),
    });

    useEffect(() => {
        (async () => {
            if (productId) {
                // Fetch the product details based on productId
                // This is just a placeholder. Replace with your actual fetch logic.
                const fetchedProduct = await getProduct(productId as string);
                setProduct(fetchedProduct);
                setInitialValues({
                    name: fetchedProduct.name,
                });
            }
        })();
    }, [productId]);

    const handleFormSubmit = async (productData: ProductCreateRequest) => {
        if (product) {
            // Update existing product
            await updateProduct(product._id!, { ...product, ...productData });
            setProduct(await getProduct(productId as string));
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <Container maxWidth="md">
            <AppBar position="static" color="primary" sx={{ mt: 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="bold">{product ? product.name : "Loading..aaa."}</Typography>
                    <Box>
                        <Button color='inherit' variant='text' size='small' onClick={() => { router.push(`/admin/products`); }}>
                            Products
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box my="20px">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Product name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="primary" variant="contained">
                                    Update Product
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Container>

    );
}
