const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Middle
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjja2r0.mongodb.net/?retryWrites=true&w=majority`;

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


        /*----------------------
            Collection & apis
        -----------------------*/

        const usersCollection = client.db('guvi-task').collection('users');

        // post users data to db
        app.post('/users', async (req, res) => {
            const newUser = req.body;

            const query = { email: newUser.email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exits' });
            }

            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })

        // get user data with email specific
        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        // update user data 
        app.patch('/users/:id', async (req, res) => {
            const body = req.body;
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: body.name,
                    age: body.age,
                    gender: body.gender,
                    dob: body.dob,
                    mobile: body.mobile
                }
            };

            const result = await usersCollection.findOneAndUpdate(query, update);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('guvi task is Running!!');
})

app.listen(port, () => {
    console.log(`guvi task is running on port: ${port}`);
})