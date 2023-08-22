import { Inter } from 'next/font/google';
import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, TextField, Toolbar, Typography, makeStyles, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { Close, Delete, Edit } from '@mui/icons-material';
import { Formik } from 'formik';
import * as yup from "yup";
import { ProductCreateRequest, createProduct, deleteProduct, getProducts, updateProduct } from '@/services/productService'; // Adjust the path if necessary
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IProduct } from '../../../../models/product';

const inter = Inter({ subsets: ['latin'] });

  
export default function Products() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [initialValues, setInitialValues] = useState<ProductCreateRequest>({
        name: "",
    });

    useEffect(() => {
        (async () => {
            setProducts(await getProducts());
        })();
    }, []);

    const checkoutSchema = yup.object().shape({
        name: yup.string().required("This field is required"),
    });

    const cols: GridColDef<IProduct>[] = [
        { field: "name", headerName: "Product", flex: 1 },
        {
            field: "actions",
            headerName: "",
            align: "right",
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id!)}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleEdit = (product: IProduct) => {
        setEditingProduct(product);
        setInitialValues({
            name: product.name
        });
        setIsPanelOpen(true);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            await deleteProduct(id);
            closePanel();
            setProducts(await getProducts());
        }
    };

    const handleFormSubmit = async (productData: ProductCreateRequest) => {
        if (editingProduct) {
            // Update existing product
            await updateProduct(editingProduct._id!, { ...editingProduct, ...productData });
            setEditingProduct(null); // Reset editing state
        } else {
            // Create new product
            await createProduct(productData);
        }
        setIsPanelOpen(false);
        setProducts(await getProducts());
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingProduct(null);
        setInitialValues({
            name: ""
        });
    };

    return (
        <Container maxWidth="lg">
            <AppBar position="static" color="primary" sx={{ mt: 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold">Products</Typography>
                    <Box>
                        <Button color='inherit' startIcon={<AddIcon />} variant='outlined' size='small' onClick={() => { setIsPanelOpen(true)}}>
                            Add
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box>
                <DataGrid
                
                    rows={products}
                    columns={cols}
                    getRowId={(prod) => prod._id!}
                    disableRowSelectionOnClick 
                />
            </Box>
            {isPanelOpen && <Drawer
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: "24%" },
                }}
                anchor={'right'}
                open={isPanelOpen}
                onClose={() => closePanel()}
            >

                <Toolbar sx={{ justifyContent: 'space-between', display: "flex", alignItems: "center" }}>
                    <Typography variant='h6' fontWeight="bold">Add Product</Typography>
                    <IconButton onClick={() => closePanel()}>
                        <Close />
                    </IconButton>
                </Toolbar>

                <Divider />

                <Box m="20px">
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
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
                                <Box display="flex" justifyContent={editingProduct ? "space-between" : "end"} mt="20px">
                                    {editingProduct && (
                                        <Button color="error" variant="contained" onClick={() => handleDelete(editingProduct._id!)}>
                                            Delete
                                        </Button>
                                    )}
                                    <Button type="submit" color="primary" variant="contained">
                                        {editingProduct ? "Update Product" : "Create Product"}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Drawer>}
        </Container>
    );
}
