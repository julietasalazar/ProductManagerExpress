const { log } = require("console");
const fs = require("fs");
const express = require("express");

const app = express();


class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    //ADDPRODUCT
    async addProduct(data) {
        const { title, description, price, thumbnail, stock, code } = data;
        if (!title || !description || !price || !thumbnail || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }


        const products = await getJsonFromFile(this.path);
        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code: products.length + 1,
            stock,
        };

        products.push(newProduct);

        await saveJsonInFile(this.path, products);
        console.log('El producto de cargo correctamente');

    }

    //GETPRODUCTS
    getProducts() {
        app.get("/products", (req, res) => {
            const {products} = req.params;
            res.json({products});
        });

    
    }

    //GETPRODUCTBYID
    getProductById() {
        app.get("/products/:pid", (req, res) => {
            const {pId} = req.params;
           products.find((p) => p.code === parseInt(pId));
           res.json(productId);
        });

    }

    //UPDATEPRODUCT
    async updateProduct(code, data) {
        const { title, description, price, thumbnail, stock } = data;
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((p) => p.code === code);
        if (position === -1) {
            throw new Error("Producto no encontrado");
        }
        if (title) {
            products[position].title = title;
        }
        if (description) {
            products[position].description = description;
        }
        if (price) {
            products[position].price = price;
        }
        if (thumbnail) {
            products[position].thumbnail = thumbnail;
        }
        if (stock) {
            products[position].stock = stock;
        }
        await saveJsonInFile(this.path, products);
        console.log("Producto actualizado correctamente");

    }

    //DELETEPRODUCT
    deleteProduct() {

    }
}

const getJsonFromFile = async (path) => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const content = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(content);
};

const saveJsonInFile = (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    return fs.promises.writeFile(path, content, 'utf-8');
}


async function test() {

    const productManager = new ProductManager('./Products.json');

    const data = {
        title: "Cuaderno",
        description: "Cuaderno anillado de hojas cuadriculadas",
        price: 2500,
        thumbnail: "imagen",
        stock: 10,
    };


    await productManager.addProduct(data);
    console.log(await productManager.getProducts());
    await productManager.updateProduct(2, { price: 4000 });
    console.log(await productManager.getProducts());
}

test();

app.listen(8080, () => {
    console.log("servidor en puerto 8080");
});