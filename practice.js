//const users = await User.find(); // Fetch all users from the database
// const newUser = await User.create(req.body); // Create a new user with data from the request body
// const user = await User.findById(req.params.id); 

//in my app.js
 
// app.use("/api/products", productRoutes)

// //in my router
// import { Router } from "express"
// import { asynchandler } from "./src/utils/asynchandler"

// const Routes = Router()


// Routes.route("/:id").get(getAllproducts)
// Routes.route("/:id").put(UpdateProduct)

// //in my get product controller

// const getAllproducts = asynchandler(async (req,res)=>{
//     const products = await Products.findbyId(req.params.id)
//     if(!products){
//         res.status(404)
//         res.json({
//             message:"The requested Product does now exist"
//         })
//     }
//     res.status(200)
//     res.json({
//         message:"Product found",
//         Products: products
//     })

// })


// //in my update product controller
// const UpdateProduct = asynchandler(async (req,res)=>{
//     const products = await Products.findbyId(req.params.id).create(req.body)
//     if(!products){
//         res.status(500)
//         res.json({
//             message:"The product was not updated"
//         })
//     }
//     res.status(200)
//     res.json({
//         message:"Product updated",
//         Products: products
//     })

// })
