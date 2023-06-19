import React from "react"
import { Link } from "react-router-dom"
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Stack,
	Button,
} from "@mui/material"
import InventoryIcon from "@mui/icons-material/Inventory"

export const Navbar = () => {
	return (
		<div>
			<AppBar
				style={{
					backgroundColor: "black",
					padding: "7px",
					// fontFamily: "Poppins",
				}}
				position="fixed"
				color="primary"
			>
				<Toolbar variant="dense">
					<IconButton
						component={Link}
						to="/"
						aria-label="logo"
						edge="start"
						color="inherit"
					>
						<InventoryIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 10 }}></Typography>
					<Stack direction="row" spacing={4}>
						<Button
							component={Link}
							to="/products"
							style={{ width: "100%", fontSize: "100%", fontFamily: "Poppins" }}
							color="inherit"
							size="large"
						>
							Products
						</Button>
						<Button
							component={Link}
							to="/customers"
							style={{ width: "100%", fontSize: "100%", fontFamily: "Poppins" }}
							color="inherit"
							size="large"
						>
							Customers
						</Button>
						<Button
							component={Link}
							to="/purchaces"
							style={{ width: "100%", fontSize: "100%", fontFamily: "Poppins" }}
							color="inherit"
							size="large"
						>
							Purchases
						</Button>
					</Stack>
				</Toolbar>
			</AppBar>
		</div>
	)
}
