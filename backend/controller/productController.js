import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"


export const addProduct = async (req,res) => {
    try {
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body

        let image1 = await uploadOnCloudinary(req.files.image1[0].path)
        let image2 = await uploadOnCloudinary(req.files.image2[0].path)
        let image3 = await uploadOnCloudinary(req.files.image3[0].path)
        let image4 = await uploadOnCloudinary(req.files.image4[0].path)
        
        let productData = {
            name,
            description,
            price :Number(price),
            category,
            subCategory,
            sizes :JSON.parse(sizes),
            bestseller :bestseller === "true" ? true : false,
            date :Date.now(),
            image1,
            image2,
            image3,
            image4
            
        }

        const product = await Product.create(productData)

        return res.status(201).json(product)

    } catch (error) {
          console.log("AddProduct error")
    return res.status(500).json({message:`AddProduct error ${error}`})
    }
    
}


export const listProduct = async (req,res) => {
     
    try {
        const product = await Product.find({});
        return res.status(200).json(product)

    } catch (error) {
        console.log("ListProduct error")
    return res.status(500).json({message:`ListProduct error ${error}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (category) updateData.category = category;
        if (subCategory) updateData.subCategory = subCategory;
        if (sizes) updateData.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
        if (stock !== undefined) updateData.stock = Number(stock);
        if (bestseller !== undefined) updateData.bestseller = bestseller === "true" || bestseller === true;
        
        // Note: Image editing is omitted for simplicity unless an image was uploaded, but the requirement is just description mostly
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        return res.status(200).json(product);
    } catch (error) {
        console.log("EditProduct error", error);
        return res.status(500).json({ message: `EditProduct error: ${error.message}` });
    }
}

import User from "../model/userModel.js";

export const getCategories = async (req,res) => {
    try {
        const products = await Product.find({});
        
        // Extract all unique categories and subcategories
        const categories = [...new Set(products.map(product => product.category).filter(cat => cat))];
        const subCategories = [...new Set(products.map(product => product.subCategory).filter(subCat => subCat))];
        
        // Define default categories if no products exist
        const defaultCategories = ['men', 'women', 'kids', 'accessories', 'electronics', 'home'];
        const defaultSubCategories = ['t-shirts', 'shirts', 'pants', 'dresses', 'shoes', 'jackets', 'watches', 'bags'];
        
        return res.status(200).json({
            categories: categories.length > 0 ? categories : defaultCategories,
            subCategories: subCategories.length > 0 ? subCategories : defaultSubCategories
        });
    } catch (error) {
        console.log("GetCategories error", error);
        return res.status(500).json({message: `GetCategories error: ${error.message}`});
    }
}

export const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, name } = req.body;
        const userId = req.userId || req.adminEmail; // userId from isAuth OR adminEmail from adminAuth
        
        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user already reviewed (if it's not admin)
        if (!req.adminEmail) {
            const alreadyReviewed = product.reviews.find(r => r.userId.toString() === userId.toString());
            if (alreadyReviewed) {
                return res.status(400).json({ message: "You have already reviewed this product" });
            }
        }

        const review = {
            name: name || "Anonymous User",
            rating: Number(rating),
            comment,
            userId,
            date: Date.now()
        };

        product.reviews.push(review);
        await product.save();

        return res.status(201).json({ message: "Review added successfully", reviews: product.reviews });
    } catch (error) {
        console.log("AddReview error", error);
        return res.status(500).json({ message: `AddReview error: ${error.message}` });
    }
}
