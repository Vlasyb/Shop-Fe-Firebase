import { db } from "../firebase"
import { collection, onSnapshot, query, doc, getDocs } from "firebase/firestore"

const initialValue = {
	customers: [],
	products: [1, 2, 3, 4, 5],
	purchaces: ["some_string_purchaces"],
}

// // state - current state
// // action - {type: 'ADD_USER', [payload: user]}
// // action - {type: 'WHAT_TO_DO', [payload:value]}
const productChanger = (state = initialValue, action) => {
	switch (action.type) {
		case "LOAD_PRODUCTS":
			const loadProductDocs = async () => {
				const querySnapshot = await getDocs(collection(db, "Products"))
				const tempProductsDocs = []
				querySnapshot.forEach((doc) => {
					tempProductsDocs.push({ id: doc.id, ...doc.data() })
				})
				return tempProductsDocs
			}
			return {
				...state,
				products: loadProductDocs(),
			}
		case "LOAD_CUSTOMERS":
			const loadCustomersDocs = async () => {
				const querySnapshot = await getDocs(collection(db, "Customers"))
				const tempCustomersDocs = []
				querySnapshot.forEach((doc) => {
					tempCustomersDocs.push({ id: doc.id, ...doc.data() })
				})
				return tempCustomersDocs
			}
			return {
				...state,
				customers: loadCustomersDocs(),
			}
		case "LOAD_PURCHACES":
			const loadPurchacesDocs = async () => {
				const querySnapshot = await getDocs(collection(db, "Purchaces"))
				const tempPurchacesDocs = []
				querySnapshot.forEach((doc) => {
					tempPurchacesDocs.push({ id: doc.id, ...doc.data() })
				})
				return tempPurchacesDocs
			}
			return {
				...state,
				purchaces: loadPurchacesDocs(),
			}
		// 	return { ...state, users: action.payload }
		// case "UPDATE": {
		// 	const users = [...state.users]
		// 	const index = users.findIndex((user) => user.id === action.payload.id)

		// 	if (index !== -1) {
		// 		users[index] = action.payload
		// 	}
		// 	return { ...state, users: users }
		// }
		default:
			return state
	}
}

export default productChanger
