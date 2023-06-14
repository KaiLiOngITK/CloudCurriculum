const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

var app = express();
const portAPI = 8081;

app.use(express.json());

// MongoDB connection URI
const host = process.env.MONGODB_HOST;

// MongoDB port
const port = process.env.MONGODB_PORT;

// MongoDB database name
const dbName = 'cloudcurriculum';

// MongoDB collection name
const collectionName = 'products';

// MongoDB connection URI
const uri = `mongodb://${host}:${port}/${dbName}`;

// GET /products - Retrieve all products
app.get('/products', async function (req, res) {
  try{
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const products = await collection.find().toArray();
    res.json(products);
  }catch(error){
    console.error('Error in retrieving products', error);
    res.status(500).json({error:'Failed to retrieve products'});
  }
});

// POST /products - Create a new product
app.post('/products', async function (req, res) {
  var product = req.body;
  try{
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    await collection.insertOne(product);
    res.status(201).json(product);
  }catch(error){
    console.error('Error in creating products', error);
    res.status(500).json({error:'Failed to create products'});
  }
  // res.status(201).json(product);
});

// GET /products/:id - Retrieve product by ID
app.get('/products/:id', async function (req, res) {
  try {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const product = await collection.findOne({ _id: id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error retrieving product', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
  // const id = +req.params.id;
  // const product = products.find((product) => product.id === id);

  // if (product) {
  //   res.json(product);
  // } else {
  //   // Sending 404 when product not found
  //   res.status(404).json({ error: 'product not found' });
  // }
});

app.delete('/products/:id', async function (req, res) {
  try {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
  // // Reading id from the URL
  // const id = +req.params.id;

  // // Remove item from the products array
  // products = products.filter(i => {
  //   if (i.id !== id) {
  //     return true;
  //   }
  //   return false;
  // });

  // res.status(200).json(products);
});

app.put('/products/:id', async function (req, res, next) {
  try {
    const id = new ObjectId(req.params.id);
    const updatedProduct = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const result = await collection.updateOne({ _id: id }, { $set: updatedProduct });
    if (result.modifiedCount === 1) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
  // const id = +req.params.id;
  // const item = products.find(item => item.id === id);
  // var product = req.body;

  // if (item) {
  //   item.id = product.id;
  //   item.name = product.name;
  //   item.email = product.email;
  // }
  // res.json(products);
  // // res.status(200).send('product is edited. \n');

});

var server = app.listen(portAPI, function () {
  console.log('Node server is running..');
});