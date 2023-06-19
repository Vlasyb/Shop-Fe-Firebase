import { useState, useEffect } from "react"
import { Typography, Button, Card, CardContent, Container } from "@mui/material"
import { Link } from "react-router-dom"
import { BoughtBy } from "./BoughtBy"
export const Product = ({ product, productPurchaces }) => {
	return (
		<div>
			<Card
				sx={{
					":hover": {
						boxShadow:
							"0 6px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)",
					},
					minWidth: 700,
					backgroundColor: "Mintcream",
					width: "50%",
					margin: "auto",
					marginTop: "2%",
				}}
			>
				<CardContent>
					<Typography variant="h6" color="initial">
						<Button
							sx={{
								fontFamily: "Poppins",
								":hover": { backgroundColor: "#cefdfd" },
								fontWeight: "600",
							}}
							component={Link}
							to={{
								pathname: `/editproduct/${product.id}`,
							}}
							style={{ width: "100%", fontSize: "100%" }}
							variant="bold"
							size="large"
						>
							{product.name}
						</Button>
					</Typography>
					<Typography
						variant="h6"
						color="initial"
						sx={{ fontFamily: "Poppins" }}
					>
						Quantity : {product.quantity}
					</Typography>
					<br />
					<Typography
						variant="h6"
						color="initial"
						sx={{ fontFamily: "Poppins" }}
					>
						Price : {product.price}
					</Typography>
					<br />
					<Typography
						variant="h6"
						color="initial"
						sx={{ fontFamily: "Poppins" }}
					>
						Bought by:
					</Typography>
					{productPurchaces.length == 0 && (
						<Container
							maxWidth="lg"
							sx={{
								fontSize: "20px",
								marginTop: "2%",
								display: "flex",
								justifyContent: "center",
								fontFamily: "Poppins",
							}}
						>
							No one has purchased this product yet
						</Container>
					)}
					{productPurchaces.map((purchace) => {
						return (
							<div key={purchace.id}>
								<BoughtBy purchace={purchace} />
							</div>
						)
					})}
				</CardContent>
			</Card>
		</div>
	)
}
