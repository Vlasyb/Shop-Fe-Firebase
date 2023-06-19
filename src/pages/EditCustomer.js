import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { doc, setDoc, deleteDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import {
	TextField,
	Typography,
	Button,
	Card,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
} from "@mui/material"

export const EditCustomer = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { id } = useParams()
	const store = useSelector((state) => state)
	const customers = useSelector((state) => state.customers)
	const purchaces = useSelector((state) => state.purchaces)
	const [customer, setCustomer] = useState({})
	const [updatedCustomer, setUpdatedCustomer] = useState({})
	const [releventPurchaces, setReleventPurchaces] = useState([])
	const [allProducts, setAllProducts] = useState([])
	const [releventProducts, setReleventProducts] = useState([])

	const filterProducts = () => {
		const tempReleventProducts = []
		const productIds = releventPurchaces.map((purchace) => {
			return purchace.ProductID
		})
		allProducts.forEach((product) => {
			if (
				productIds.includes(product.id) &&
				!tempReleventProducts.includes(product.id)
			) {
				tempReleventProducts.push(product)
				// console.log("new ", customer.FirstName)
			}
		})
		console.log("new ", tempReleventProducts)
		return tempReleventProducts
	}
	useEffect(() => {
		try {
			setReleventProducts(filterProducts())
		} catch {
			console.log("promise")
		}
	}, [allProducts, releventPurchaces]) //using only one of them also works

	useEffect(() => {
		try {
			store.products.then((data) => {
				setAllProducts(data)
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
		try {
			purchaces.then((data) => {
				setReleventPurchaces(
					data.filter((purchace) => id === purchace.CustomerID)
				)
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
		try {
			customers.then((data) => {
				setCustomer(data.filter((cust) => id === cust.id)[0])
				setUpdatedCustomer({
					FirstName: customer.FirstName,
					LastName: customer.LastName,
					City: customer.City,
				})
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
	}, [customers, purchaces, store, customer])

	const handleUpdate = async () => {
		await setDoc(doc(db, "Customers", id), updatedCustomer)
		dispatch({ type: "LOAD_CUSTOMERS" })
		alert("Customer Updated")
	}
	const handleDelete = async () => {
		releventPurchaces.forEach(async (purchace) => {
			if (purchace.CustomerID === id) {
				await deleteDoc(doc(db, "Purchaces", purchace.id))
			}
		})

		await deleteDoc(doc(db, "Customers", id))
		dispatch({ type: "LOAD_PURCHACES" })
		dispatch({ type: "LOAD_CUSTOMERS" })
		alert("Customer Deleted")
		navigate("/products")
	}
	return (
		<div>
			<div id="region1">
				<Typography
					variant="h3"
					color="initial"
					sx={{ textAlign: "center", marginTop: "5%", fontFamily: "Poppins" }}
				>
					Edit {customer.FirstName} {customer.LastName}
				</Typography>
				<Card
					sx={{
						":hover": {
							boxShadow:
								"0 6px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)",
						},
						width: "60%",
						margin: "auto",
						marginTop: "3%",
						padding: "5%",
						backgroundColor: "#e6fefe",
					}}
				>
					<Typography variant="h6" color="initial" className="EditContainer">
						<span className="EditElement">First Name : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-custName"
							variant="filled"
							label="First Name of customer"
							helperText={`Current is ${customer.FirstName}`}
							onChange={(e) => {
								setUpdatedCustomer({
									...updatedCustomer,
									FirstName: e.target.value,
								})
								console.log(updatedCustomer)
							}}
						/>
					</Typography>
					<Typography variant="h6" color="initial" className="EditContainer">
						<span className="EditElement">Last Name : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-custName"
							variant="filled"
							label="Last Name of customer"
							helperText={`Current is ${customer.LastName}`}
							onChange={(e) => {
								setUpdatedCustomer({
									...updatedCustomer,
									LastName: e.target.value,
								})
								console.log(updatedCustomer)
							}}
						/>
					</Typography>
					<Typography variant="h6" color="initial" className="EditContainer">
						<span className="EditElement">City : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-custName"
							variant="filled"
							label="City of customer"
							helperText={`Current is ${customer.City}`}
							onChange={(e) => {
								setUpdatedCustomer({
									...updatedCustomer,
									City: e.target.value,
								})
								console.log(updatedCustomer)
							}}
						/>
					</Typography>
					<div className="EditPageButtons">
						<Button
							sx={{
								":hover": { backgroundColor: "#1a8cff" },
								backgroundColor: "#99ccff",
								marginTop: "1%",
								width: "100%",
								fontSize: "100%",
							}}
							onClick={() => handleUpdate()}
							variant="bold"
						>
							Update
						</Button>
						<Button
							sx={{
								":hover": { backgroundColor: "#1a8cff" },
								backgroundColor: "#99ccff",
								marginTop: "1%",
								width: "100%",
								fontSize: "100%",
							}}
							onClick={() => handleDelete()}
							variant="bold"
						>
							Delete
						</Button>
					</div>
				</Card>
			</div>
			<div id="region2">
				<Typography
					variant="h3"
					color="initial"
					sx={{ textAlign: "center", marginTop: "5%", fontFamily: "Poppins" }}
				>
					Products Bought:
				</Typography>

				<List sx={{ padding: "1%" }}>
					{releventProducts.map((product) => {
						return (
							<ListItem
								sx={{
									textAlign: "center",
									backgroundColor: "black",
									color: "white",
									alignContent: "center",
									opacity: "0.92",
									":hover": { opacity: "1" },
									width: "50%",
									margin: "auto",
									marginTop: "2%",
								}}
								disablePadding
								key={product.id}
							>
								<ListItemButton
									component={Link}
									to={{
										pathname: `/editproduct/${product.id}`,
									}}
								>
									<ListItemText
										sx={{ textAlign: "center" }}
										primary={product.name}
									/>
								</ListItemButton>
							</ListItem>
						)
					})}
				</List>
			</div>
		</div>
	)
}
