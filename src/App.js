import { Route, Routes, useLocation } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Products } from "./pages/Products"
import { Customers } from "./pages/Customers"
import { Purchaces } from "./pages/Purchaces"
import { EditProduct } from "./pages/EditProduct"
import { EditCustomer } from "./pages/EditCustomer"
import "./appcss.css"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

function App() {
	const location = useLocation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch({ type: "LOAD_PRODUCTS" })
		dispatch({ type: "LOAD_CUSTOMERS" })
		dispatch({ type: "LOAD_PURCHACES" })
	}, [])
	return (
		<div>
			<Navbar />
			<div
				className="AppContainer"
				style={{
					marginTop: "50px",
				}}
			>
				<Routes>
					<Route path="/" />
					<Route path="/products" element={<Products />} />
					<Route path="/customers" element={<Customers />} />
					<Route path="/purchaces" element={<Purchaces />} />
					<Route path="/editproduct/:id" element={<EditProduct />} />
					<Route path="/editcustomer/:id" element={<EditCustomer />} />
				</Routes>

				{location.pathname == "/" && (
					<h1 className="HomePageHeader">
						<span>Welcome to our shop</span>
						<span style={{ color: "#8187dc" }}>!</span>
					</h1>
				)}
			</div>
		</div>
	)
}

export default App
