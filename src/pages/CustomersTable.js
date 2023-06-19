import { useState, useEffect } from "react"
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import {
	Typography,
	Button,
	List,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TableCell,
	ListItem,
	ListItemButton,
	ListItemText,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

export const CustomersTable = ({
	customersProp,
	productsProp,
	purchacesProp,
	dateProp,
	search,
}) => {
	const [joinedTable, setJoinedTable] = useState([])

	const joinTables = () => {
		let joinedTableTemp = []
		customersProp.forEach((customer) => {
			let isDateSuitable = false
			let joinedTableElement = {}
			joinedTableElement.customer = customer
			joinedTableElement.productsBought = []
			joinedTableElement.dates = []
			purchacesProp.forEach((purchace) => {
				if (purchace.CustomerID === customer.id) {
					productsProp.forEach((product) => {
						if (purchace.ProductID === product.id) {
							if (dateProp == "") {
								joinedTableElement.productsBought.push(product) //lined down
								joinedTableElement.dates.push(purchace.Date)
							} else {
								let inputDates = dateProp.split("/")
								let givenDate = new Date(
									inputDates[2],
									+inputDates[1] - 1,
									inputDates[0]
								)
								let purchaceDate = new Date(
									purchace.Date.seconds * 1000 +
										purchace.Date.nanoseconds / 100000
								)
								if (
									purchaceDate.getDay() == givenDate.getDay() &&
									purchaceDate.getFullYear() == givenDate.getFullYear() &&
									purchaceDate.getMonth() == +givenDate.getMonth()
								) {
									joinedTableElement.dates.push(purchace.Date)
									joinedTableElement.productsBought.push(product) //new line
									isDateSuitable = true
								}
							}
						}
					})
				}
			})
			if (
				!(search && joinedTableElement.productsBought.length == 0) &&
				(isDateSuitable || dateProp == "")
			) {
				joinedTableTemp.push(joinedTableElement)
			}
		})
		//
		console.log(joinedTableTemp)
		return joinedTableTemp
	}
	useEffect(() => {
		setJoinedTable(joinTables())
	}, [customersProp, productsProp, purchacesProp, dateProp])
	return (
		<div>
			<TableContainer
				component={Paper}
				sx={{
					marginTop: "2%",
					backgroundColor: "#e6fefe",
					":hover": {
						boxShadow:
							"0 6px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)",
					},
				}}
			>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									color: "black",
									fontFamily: "Poppins",
									fontWeight: "600",
									fontSize: "15px",
								}}
							>
								Customer Name
							</TableCell>
							<TableCell
								sx={{
									color: "black",
									fontFamily: "Poppins",
									fontWeight: "600",
									fontSize: "15px",
								}}
								align="left"
							>
								Products bought
							</TableCell>
							<TableCell
								sx={{
									color: "black",
									fontFamily: "Poppins",
									fontWeight: "600",
									fontSize: "15px",
								}}
								align="left"
							>
								Purchase Dates
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{joinedTable.map((joinedTableElement) => (
							<TableRow
								key={joinedTableElement.customer.id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell
									component="th"
									scope="customer"
									sx={{ color: "black", fontFamily: "Poppins" }}
								>
									{joinedTableElement.customer.FirstName}{" "}
									{joinedTableElement.customer.LastName}
								</TableCell>
								<TableCell //all the products
									sx={{ color: "black", fontFamily: "Poppins" }}
									align="left"
								>
									<List sx={{ padding: "1%" }}>
										{joinedTableElement.productsBought?.map(
											(product, index) => (
												<ListItem disablePadding key={product.id + index}>
													<ListItemButton
														sx={{ fontSize: "15px" }}
														component={Link}
														to={{
															pathname: `/editproduct/${product.id}`,
														}}
													>
														{product.name}
													</ListItemButton>
												</ListItem>
											)
										)}
									</List>
								</TableCell>
								<TableCell // all the purchase dates
									sx={{ color: "black", fontFamily: "Poppins" }}
									align="left"
								>
									<List sx={{ padding: "1%" }}>
										{joinedTableElement.dates?.map((date) => (
											<ListItem disablePadding key={date}>
												{new Date(
													date.seconds * 1000 + date.nanoseconds / 100000
												)
													.toString()
													.slice(4, 25)}
											</ListItem>
										))}
									</List>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}
