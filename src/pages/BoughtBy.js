import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { db } from "../firebase"
import { useDispatch } from "react-redux"
import {
	Typography,
	Button,
	Card,
	CardContent,
	Autocomplete,
	TextField,
} from "@mui/material"
// connected-to-git

export const BoughtBy = ({ purchace }) => {
	const dispatch = useDispatch()

	const store = useSelector((state) => state)
	const [addButton, setAddButton] = useState(false)
	const [customer, setCustomer] = useState({})
	const [allProducts, setAllProducts] = useState([])
	const [chosenProduct, setChosenProduct] = useState("")

	useEffect(() => {
		try {
			store.products.then((data) => {
				setAllProducts(data)
			})
		} catch {
			console.log("products not a promise yet")
		}
		try {
			store.customers.then((data) => {
				let relatedCustomer =
					data[
						data.findIndex((customer) => customer.id === purchace.CustomerID)
					]
				setCustomer(relatedCustomer)
			})
		} catch {
			console.log("Customers not a promise yet from boughtby")
		}
	}, [customer, allProducts])

	const makePurchace = async () => {
		setAddButton(!addButton)
		let productToPurchace = allProducts.filter((prod) => {
			return prod.name === chosenProduct
		})[0]
		if (productToPurchace.quantity < 1) {
			alert("Couldn't buy item. Out of stock")
			return
		}

		let newPurchace = {
			ProductID: productToPurchace.id,
			CustomerID: customer.id,
			Date: Timestamp.fromDate(new Date()),
		}
		console.log(newPurchace)
		await setDoc(doc(db, "Purchaces", uuidv4()), newPurchace)
		dispatch({ type: "LOAD_PURCHACES" })
		const productDoc = doc(db, "Products", productToPurchace.id)
		updateDoc(productDoc, {
			quantity: productToPurchace.quantity - 1,
		})
		dispatch({ type: "LOAD_PRODUCTS" })
		alert(
			`${customer.FirstName} ${customer.LastName} successfully bought a ${productToPurchace.name}`
		)
	}
	return (
		<div>
			<Card
				sx={{
					":hover": {
						boxShadow:
							"0 6px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)",
					},
					width: "80%",
					margin: "auto",
					marginTop: "3%",
				}}
			>
				<CardContent sx={{ backgroundColor: "#e6fefe" }}>
					<Button
						sx={{
							":hover": { backgroundColor: "#bafdfd" },
							padding: "0%",
							paddingTop: "1%",
							paddingBottom: "2%",
							margin: "0%",
							fontFamily: "Poppins",
							fontWeight: "600",
						}}
						component={Link}
						to={{
							pathname: `/editcustomer/${customer.id}`,
						}}
						style={{ fontSize: "100%" }}
						variant="bold"
					>
						{"-" + customer.FirstName + " " + customer.LastName + "-"}
					</Button>
					<Typography sx={{ paddingTop: "3%", fontFamily: "Poppins" }}>
						Purchased At :{" "}
						{new Date(
							purchace.Date.seconds * 1000 + purchace.Date.nanoseconds / 100000
						)
							.toString()
							.slice(4, 25)}
					</Typography>
					<Button
						sx={{
							":hover": { backgroundColor: "black", opacity: "1" },
							backgroundColor: "black",
							marginTop: "5%",
							fontFamily: "Poppins",
							opacity: "0.85",
						}}
						onClick={() => setAddButton(!addButton)}
						style={{ width: "30%", fontSize: "100%" }}
						variant="contained"
					>
						ADD
					</Button>
					{addButton && (
						<Autocomplete
							onChange={(event, newValue) => {
								setChosenProduct(newValue.label)
								// console.log(newValue.label)
							}}
							id="product-combo-box"
							options={allProducts.map((prod) => {
								return { label: prod.name }
							})}
							sx={{ width: "inherit", marginTop: "2%" }}
							renderInput={(params) => (
								<TextField {...params} label="Products" />
							)}
						/>
					)}
					{addButton && (
						<Button
							sx={{
								":hover": { backgroundColor: "black", opacity: "1" },
								backgroundColor: "black",
								marginTop: "1%",
								opacity: "0.85",
								width: "100%",
								fontSize: "100%",
								fontFamily: "Poppins",
							}}
							onClick={() => makePurchace()}
							variant="contained"
						>
							SAVE
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
