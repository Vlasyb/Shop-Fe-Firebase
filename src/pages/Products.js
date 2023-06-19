import React from "react"
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"
import { Product } from "./Product"

export const Products = () => {
	const dispatch = useDispatch()
	const store = useSelector((state) => state)
	const [products, setProducts] = useState([])
	const [purchaces, setPurchaces] = useState([])
	const [customers, setCustomers] = useState([])

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
		// console.log(store)
	}, [store])

	return (
		<div>
			<br />
			<div id="region1">
				<Typography
					variant="h4"
					color="initial"
					sx={{
						marginLeft: "3%",
						fontWeight: "600",
					}}
				>
					Total Products Purchased : {purchaces.length}
				</Typography>
			</div>{" "}
			<br /> <br />
			<div id="region2">
				<Typography
					variant="h2"
					color="initial"
					sx={{
						textAlign: "center",
						fontFamily: "Poppins",
					}}
				>
					Products
				</Typography>
				{products.map((product) => {
					return (
						<div key={product.id}>
							<Product
								product={product}
								productPurchaces={purchaces.filter(
									(purchace) => purchace.ProductID === product.id
								)}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}
