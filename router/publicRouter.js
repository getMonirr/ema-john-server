const express = require("express");
const publicRouter = express.Router();
const { ObjectId } = require("mongodb");

// default get
publicRouter.get("/", (req, res) => {
    res.send("ema john server is running...");
});

publicRouter.get("/products", async (req, res) => {
    const products = await req.productsCollection.find().toArray();

    res.send(products);
});

publicRouter.get("/products/total", async (req, res) => {
    const totalProducts = await req.productsCollection.countDocuments();

    res.send({ totalProducts });
});

publicRouter.post("/products", async (req, res) => {
    const currentPage = parseInt(req.query.page) || 0;
    const itemsPerPage = parseInt(req.query.limit) || 10;
    const startIndex = currentPage * itemsPerPage;

    const products = await req.productsCollection
        .find()
        .skip(startIndex)
        .limit(itemsPerPage)
        .toArray();

    res.send(products);
});

// get cart products
publicRouter.post("/productsInCart", async (req, res) => {
    const productIds = req.body.cartProductsIds.map((id) => new ObjectId(id));

    const cartProducts = await req.productsCollection
        .find({ _id: { $in: productIds } })
        .toArray();

    res.send(cartProducts);
});

module.exports = publicRouter;
