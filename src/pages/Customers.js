import {
	Typography,
	Button,
	Box,
	Container,
	Grid,
	TextField,
	Autocomplete,
} from "@mui/material"
import { db } from "../firebase"
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import "../appcss.css"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CustomersTable } from "./CustomersTable"

export const Customers = () => {
	const dispatch = useDispatch()
	const store = useSelector((state) => state)
	const [products, setProducts] = useState([])
	const [purchaces, setPurchaces] = useState([])
	const [customers, setCustomers] = useState([])
	const [buyButton, setBuyButton] = useState(false) // INITIATE FALSE
	const [chosenProduct, setChosenProduct] = useState("")
	const [chosenCustomer, setChosenCustomer] = useState("")

	useEffect(() => {
		try {
			store.products.then((data) => {
				setProducts(data)
			})
		} catch {
			console.log("products not a promise yet")
		}
		try {
			store.purchaces.then((data) => {
				setPurchaces(data)
			})
		} catch {
			console.log("Purchaces not a promise yet")
		}
		try {
			store.customers.then((data) => {
				setCustomers(data)
			})
		} catch {
			console.log("Customers not a promise yet")
		}
	}, [store])

	const handleBuyProduct = async (e) => {
		e.preventDefault()
		console.log("submit form")
		let productToPurchace = products.filter((prod) => {
			return prod.name === chosenProduct
		})[0]

		if (productToPurchace.quantity < 1) {
			alert("Couldn't buy item. Out of stock")
			return
		}

		let customerBuying = customers.filter((cust) => {
			return cust.FirstName === chosenCustomer
		})[0]
		console.log("cust", customerBuying, "\n")
		console.log("prod", productToPurchace)
		let newPurchace = {
			ProductID: productToPurchace.id,
			CustomerID: customerBuying.id,
			Date: Timestamp.fromDate(new Date()),
		}
		await setDoc(doc(db, "Purchaces", uuidv4()), newPurchace)
		dispatch({ type: "LOAD_PURCHACES" })
		const productDoc = doc(db, "Products", productToPurchace.id)
		updateDoc(productDoc, {
			quantity: productToPurchace.quantity - 1,
		})
		dispatch({ type: "LOAD_PRODUCTS" })
		alert(
			`${customerBuying.FirstName} ${customerBuying.LastName} successfully bought a ${productToPurchace.name}`
		)
	}

	return (
		<div>
			<div id="customers_region1">
				<Typography
					variant="h2"
					color="initial"
					sx={{
						textAlign: "center",
						textDecoration: "underline",
						fontFamily: "Poppins",
						marginTop: "2%",
					}}
				>
					Customers
				</Typography>
				<Container maxWidth="lg" sx={{ textAlign: "center" }}>
					<CustomersTable
						customersProp={customers}
						purchacesProp={purchaces}
						productsProp={products}
						dateProp={""}
						search={false}
					/>
				</Container>
			</div>
			<div id="customers_region2">
				<Button
					sx={{
						":hover": {
							opacity: "1",
							backgroundColor: "black",
						},
						backgroundColor: "black",
						opacity: "0.9",
						overflow: "hidden",
						width: "30%",
						fontSize: "20px",
						left: "35%",
						color: "white",
						marginTop: "5%",
					}}
					variant="bold"
					onClick={() => setBuyButton(!buyButton)}
				>
					Buy Product
				</Button>
				{buyButton && (
					<form onSubmit={handleBuyProduct}>
						<Grid
							container
							spacing={2}
							sx={{ marginTop: "2%", justifyContent: "center" }}
						>
							<Grid item xs={3.5}>
								<Autocomplete
									onChange={(event, newValue) => {
										setChosenProduct(newValue.label)
									}}
									options={products.map((prod) => {
										return { label: `${prod.name}` }
									})}
									renderInput={(params) => (
										<TextField
											{...params}
											id="firstName"
											label="Select Product"
											required={true}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={3.5}>
								<Autocomplete
									onChange={(event, newValue) => {
										setChosenCustomer(newValue.label.split(" ")[0])
									}}
									options={customers.map((cust) => {
										return { label: `${cust.FirstName} ${cust.LastName}` }
									})}
									renderInput={(params) => (
										<TextField
											{...params}
											id="firstName"
											label="Select Customer"
											required={true}
										/>
									)}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							sx={{
								":hover": {
									opacity: "1",
									backgroundColor: "black",
								},
								backgroundColor: "black",
								opacity: "0.9",
								overflow: "hidden",
								width: "20%",
								fontSize: "15px",
								left: "40%",
								color: "white",
								marginTop: "5%",
							}}
							variant="bold"
						>
							Buy
						</Button>
					</form>
				)}
			</div>
		</div>
	)
}
