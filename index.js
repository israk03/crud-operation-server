const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

//
// crud_example

const uri =
  "mongodb+srv://crud_example:LInmnYosNHG44DI<#>@cluster0.e3qys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const gym_schedule = client.db("crud_example").collection("schedule");
    const gym_members = client.db("crud_example").collection("members");

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // get
    app.get("/schedule", async (req, res) => {
      const cursor = gym_schedule.find();
      const result = await cursor.toArray();

      res.send(result);
    });
    // create
    app.post("/add_schedule", async (req, res) => {
      const schedule = req.body;
      console.log("Received data:", schedule);
      const result = await gym_schedule.insertOne(schedule);
      res.send(result);
    });

    // delete
    app.delete("/delete_schedule/:id", async (req, res) => {
      const id = req.params.id;
      const result = await gym_schedule.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update
    app.get("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const result = await gym_schedule.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.patch("/update_schedule/:id", async (req, res) => {
      const id = req.params.id;
      const updatedSchedule = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: updatedSchedule.title,
          day: updatedSchedule.day,
          time: updatedSchedule.time,
          date: updatedSchedule.date,
        },
      };

      const result = await gym_schedule.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/update_status/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          isCompleted: true,
        },
      };

      const result = await gym_schedule.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
