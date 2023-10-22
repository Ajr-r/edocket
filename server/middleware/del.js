const uri = `mongodb+srv://dev:123@cluster0.ezfklxz.mongodb.net/?retryWrites=true&w=majority`;

const { MongoClient,ObjectId } = require("mongodb");
const client = new MongoClient(uri);
// const ob=new ObjectId();
let st=null
async function del(id) {
    // console.log(id)

  try {
    await client.connect();
    console.log('connected to db');
    const database = client.db("edocket");
    const ratings = database.collection("udata");
    const query = { _id: new ObjectId(id) };
    
    const result = await ratings.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Document deleted successfully");
      st=1
      
    } else {
      console.log("Document not found");
      st=0
    }
  } finally {
    
      await client.close();
    
  }

  return st; // Return the result after closing the connection.
}

module.exports = {
  del
}
