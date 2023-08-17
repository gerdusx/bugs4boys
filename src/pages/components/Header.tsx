import { AppBar, Box, Button, Divider, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FacebookIcon from '@mui/icons-material/Facebook';

const Header = () => {
    return (
        <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: "white" }}>
            <Toolbar style={{ position: 'relative', justifyContent: 'center' }}>
                {/* Horizontal Divider */}
                <Divider sx={{ position: 'absolute', top: '50%', left: "5%", width: '90%', bgcolor: "black", alignContent: "center" }} />

                {/* Logo */}
                <IconButton edge="start" color="inherit" aria-label="logo" href="/" style={{ zIndex: 1 }}>
                    <Image src="/b4b_logo.webp" alt="Bugs4Boys Logo" width={350} height={270} />
                </IconButton>
            </Toolbar>

            {/* Navigation Toolbar */}
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center">
                        <IconButton color="inherit" href="#">
                            <FacebookIcon />
                        </IconButton>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Button color="inherit" href="/">Home</Button>
                        <Button color="inherit" href="/shop">Shop</Button>
                        <Button color="inherit" href="/about">About</Button>
                        <Button color="inherit" href="/contact">Contact</Button>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {/* Shopping Cart on the right */}
                        <IconButton color="inherit" href="/cart">
                            <ShoppingCartIcon />
                        </IconButton>
                    </Box>

                {/* ... add more navigation buttons as needed */}
            </Toolbar>
        </AppBar >
    );
};

export default Header;