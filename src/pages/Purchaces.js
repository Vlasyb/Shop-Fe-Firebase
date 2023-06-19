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

export const Purchaces = () => {
	const store = useSelector((state) => state)
	const [products, setProducts] = useState([])
	const [purchaces, setPurchaces] = useState([])
	const [customers, setCustomers] = useState([])
	const [chosenProduct, setChosenProduct] = useState("")
	const [chosenCustomer, setChosenCustomer] = useState("")
	const [searchButton, setsSarchButton] = useState(false) // INITIATE FALSE
	const [date, setDate] = useState("")

	const getCustomerByName = () => {
		let customerBuying = customers.filter((cust) => {
			return cust.FirstName === chosenCustomer
		})
		return customerBuying
	}
	const getProductByName = () => {
		let productToPurchace = products.filter((prod) => {
			return prod.name === chosenProduct
		})
		return productToPurchace
	}

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
	return (
		<div
			style={{
				// backgroundColor: "#e6fefe",
				marginTop: "4em",
				paddingBottom: "1em",
			}}
		>
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
				Search Purchases
			</Typography>

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
							<TextField {...params} id="firstName" label="Select Product" />
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
							<TextField {...params} id="firstName" label="Select Customer" />
						)}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				sx={{
					justifyContent: "center",
					alignItems: "center",
					marginTop: "5%",
				}}
			>
				(dd/mm/yyyy) format
				<TextField
					sx={{ justifyContent: "center", alignItems: "center" }}
					id="filled-date"
					variant="filled"
					label="Date"
					onChange={(e) => {
						setDate(e.target.value)
					}}
				/>
			</Grid>
			<Button
				onClick={() => setsSarchButton(true)}
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
				Search
			</Button>
			{searchButton && (
				<Container maxWidth="lg" sx={{ textAlign: "center" }}>
					<CustomersTable
						customersProp={
							getCustomerByName().length == 0 ? customers : getCustomerByName()
						}
						purchacesProp={purchaces}
						productsProp={
							getProductByName().length == 0 ? products : getProductByName()
						}
						dateProp={date}
						search={true}
					/>
				</Container>
			)}
		</div>
	)
}
