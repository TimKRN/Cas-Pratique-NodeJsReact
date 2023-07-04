const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productModel = require('./models/products');
const todoModel = require('./models/todo');
const client = require('./database')

const app = express();

mongoose.connect('mongodb+srv://timkrn:Krn910912@cluster0.brmgviz.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

client.connect()
  .then(() => console.log('Connexion à PostgreSQL réussie !'))
  .catch(() => console.log('Connexion à PostgreSQL échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//___________________________PRODUCTS WITH PostgreSQL________________________________________

// app.get('/api/pg/products', async (req, res, next) => {

//   try {
//     const products = await client.query(`
//     SELECT product.name,
//       article.color,
//       article.size,
//       article.total_price,      
//       product.slug,
//       product.description,
//       brand.name AS brandName,
//       product_type.name AS productTypeName,
//       product_type.description AS productTypeDesc,
//       discount.percent_value,
//       discount.value
//     FROM product
//     JOIN brand ON brand.id = product.brandid
//     JOIN product_type ON product.typeid = product_type.id
//     JOIN article ON article.productid = product.id 
//     LEFT JOIN discount ON article.discountid = discount.id
//     ORDER BY product.name
//     `);
//     console.log(products);
//     res.json(products.rows);
//   } catch(e) {
//     console.error(e);
//     res.status(500).send('Une erreur est survenue')
//   }

// });



//___________________________PRODUCTS________________________________________

app.post('/api/products', (req, res, next) => {
  delete req.body._id;
  const product = new productModel({
    ...req.body
  });
  product.save()
    .then(() => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }));
});

app.put('/api/products/:id', (req, res, next) => {
  productModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!' }))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/products/:id', (req, res, next) => {
  productModel.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/products/:id', (req, res, next) => {
  productModel.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({ product: product }))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/products', (req, res, next) => {
  productModel.find()
    .then(products => res.status(200).json({ products: products }))
    .catch(error => res.status(400).json({ error }));
});

//___________________________TODO________________________________________

app.post('/api/todo', (req, res, next) => {
  delete req.body._id;
  console.log(req.body)
  const todo = new todoModel({
    ...req.body
  });
  todo.save()
    .then(() => {
      setTimeout(() => {
        res.status(201).json({ message: "La tâche a été créée" });
      }, 2000);
    })
    .catch(error => res.status(400).json({ error }));
});

app.put('/api/todo/:id', (req, res, next) => {
  todoModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => {
      setTimeout(() => {
        res.status(200).json({ message: 'La tâche a été mise à jour' })
      }, 2000);
    })
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/todo/:id', (req, res, next) => {
  todoModel.deleteOne({ _id: req.params.id })
    .then(() => {
      setTimeout(() => {
        res.status(200).json({ message: 'La tâche a été suprimée' })
      }, 2000);
    })
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/todo', (req, res, next) => {
  todoModel.find()
    .then(todolist => {
      setTimeout(() => {
        res.status(200).json({ todolist: todolist })
      }, 1000);
    })
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;