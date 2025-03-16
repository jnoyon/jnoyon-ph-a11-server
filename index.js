const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://jnoyon-ph-a11.surge.sh'], // List both frontend origins
  credentials: true,  // Allow sending cookies (if required)
}));


app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7gty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const roomsCollection = client.db('StockRoom').collection('roomCollection');
    const reviewsCollection = client.db('StockRoom').collection('reviewCollection');
    const bookedCollection = client.db('StockRoom').collection('bookedCollection');

    app.get('/rooms', async(req, res)=> {
        const cursor = roomsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/rooms/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await roomsCollection.findOne(query);
      res.send(result);
    })

    app.put('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const room = {
        $set: {
          availability: false,
        },
      };
      const result = await roomsCollection.updateOne(query, room);
      res.send(result);
    });


    // Room Review API
    app.post('/reviews', async(req, res) => {
      const newReview = req.body;
      const result = await reviewsCollection.insertOne(newReview);
      res.send(result);
    })

    app.get('/reviews', async(req, res)=> {
      const cursor = reviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });

  app.get('/reviews/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await reviewsCollection.findOne(query);
    res.send(result);
  })

  app.delete('/reviews/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await reviewsCollection.deleteOne(query);
    res.send(result)
  })

  app.patch("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const { date } = req.body;
    const query = { _id: new ObjectId(id) };
    const update = { $set: { date: date } };
    const result = await reviewsCollection.updateOne(query, update);
    res.send(result);
  });


    // Room Booking API
    app.post('/room-bookings', async(req, res) => {
      const bookedRoom = req.body;
      const result = await bookedCollection.insertOne(bookedRoom);
      res.send(result);
    })

    app.get('/room-bookings', async(req, res)=> {
      const cursor = bookedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });

  app.get('/room-bookings/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await bookedCollection.findOne(query);
    res.send(result);
  })

  app.delete('/room-bookings/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await bookedCollection.deleteOne(query);
    res.send(result)
  })

  app.patch("/room-bookings/:id", async (req, res) => {
    const id = req.params.id;
    const { date } = req.body;
    const query = { _id: new ObjectId(id) };
    const update = { $set: { date: date } };
    const result = await bookedCollection.updateOne(query, update);
    res.send(result);
  });
  


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is Working');
})

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})