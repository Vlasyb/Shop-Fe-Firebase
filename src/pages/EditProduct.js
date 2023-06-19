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

export const EditProduct = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { id } = useParams()
	const store = useSelector((state) => state)
	const products = useSelector((state) => state.products)
	const purchaces = useSelector((state) => state.purchaces)
	const [product, setProduct] = useState({})
	const [updatedProduct, setUpdatedProduct] = useState({})
	const [releventPurchaces, setReleventPurchaces] = useState([])
	const [allCustomers, setAllCustomers] = useState([])
	const [releventCustomers, setReleventCustomers] = useState([])

	const filterCustomers = () => {
		const tempReleventCustomers = []
		const customerIds = releventPurchaces.map((purchace) => {
			return purchace.CustomerID
		})
		allCustomers.forEach((customer) => {
			if (
				customerIds.includes(customer.id) &&
				!tempReleventCustomers.includes(customer.id)
			) {
				tempReleventCustomers.push(customer)
				// console.log("new ", customer.FirstName)
			}
		})
		return tempReleventCustomers
	}
	useEffect(() => {
		try {
			setReleventCustomers(filterCustomers())
		} catch {
			console.log("promise")
		}
	}, [allCustomers, releventPurchaces]) //using only one of them also works

	useEffect(() => {
		try {
			store.customers.then((data) => {
				setAllCustomers(data)
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
		try {
			purchaces.then((data) => {
				setReleventPurchaces(
					data.filter((purchace) => id === purchace.ProductID)
				)
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
		try {
			products.then((data) => {
				setProduct(data.filter((prod) => id === prod.id)[0])
				setUpdatedProduct({
					name: product.name,
					price: product.price,
					quantity: product.quantity,
				})
			})
		} catch {
			console.log("not a promise yet From editProduct")
		}
	}, [products, purchaces, store, product])

	const handleUpdate = async () => {
		await setDoc(doc(db, "Products", id), updatedProduct)
		dispatch({ type: "LOAD_PRODUCTS" })
		alert("Product Updated")
	}
	const handleDelete = async () => {
		releventPurchaces.forEach(async (purchace) => {
			if (purchace.ProductID === id) {
				await deleteDoc(doc(db, "Purchaces", purchace.id))
			}
		})

		await deleteDoc(doc(db, "Products", id))
		dispatch({ type: "LOAD_PURCHACES" })
		dispatch({ type: "LOAD_PRODUCTS" })
		alert("Product Deleted")
		navigate("/")
	}
	return (
		<div>
			<div id="region1">
				<Typography
					variant="h3"
					color="initial"
					sx={{ textAlign: "center", marginTop: "5%", fontFamily: "Poppins" }}
				>
					Edit {product.name}
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
						<span className="EditElement">Name : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-prodName"
							variant="filled"
							label="Name of product"
							helperText={`Current is ${product.name}`}
							onChange={(e) => {
								setUpdatedProduct({ ...updatedProduct, name: e.target.value })
								console.log(updatedProduct)
							}}
						/>
					</Typography>
					<Typography variant="h6" color="initial" className="EditContainer">
						<span className="EditElement">Price : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-prodName"
							variant="filled"
							label="Price of product"
							helperText={`Current is ${product.price}`}
							onChange={(e) => {
								setUpdatedProduct({ ...updatedProduct, price: +e.target.value })
								console.log(updatedProduct)
							}}
						/>
					</Typography>
					<Typography variant="h6" color="initial" className="EditContainer">
						<span className="EditElement">Quantity : </span>
						<TextField
							sx={{ width: "40%" }}
							id="filled-prodName"
							variant="filled"
							label="Quantity of product"
							helperText={`Current is ${product.quantity}`}
							onChange={(e) => {
								setUpdatedProduct({
									...updatedProduct,
									quantity: +e.target.value,
								})
								console.log(updatedProduct)
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
					Bought By:
				</Typography>

				<List sx={{ padding: "1%" }}>
					{releventCustomers.map((customer) => {
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
								key={customer.id}
							>
								<ListItemButton
									component={Link}
									to={{
										pathname: `/editcustomer/${customer.id}`,
									}}
								>
									<ListItemText
										sx={{ textAlign: "center" }}
										primary={`${customer.FirstName} ${customer.LastName}`}
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
