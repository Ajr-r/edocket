const uri = `mongodb+srv://dev:123@cluster0.ezfklxz.mongodb.net/?retryWrites=true&w=majority`;
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);
async function add(formData) {
  try {
    await client.connect();
  console.log('connected to db')
    const database = client.db("edocket");
    const ratings = database.collection("udata");
    //  const cursor = ratings.find();
    const insertResult = await ratings.insertOne(formData);
    console.log("Inserted document:");
  } finally {
    await client.close();
  }
}

module.exports={

  add
}