const uri = `mongodb+srv://dev:123@cluster0.ezfklxz.mongodb.net/?retryWrites=true&w=majority`;
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);

async function find(n) {
  let result = null; // Initialize result to null.

  try {
    await client.connect();
    console.log('connected to db');
    const database = client.db("edocket");
    const ratings = database.collection("udata");
    const query = { name: n };
    result = await ratings.find(query).toArray();
    // console.log(result);
  } finally {
    
      await client.close();
    
  }

  return result; // Return the result after closing the connection.
}

module.exports = {
  find
}
