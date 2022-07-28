module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { MongoClient } = require("mongodb");
    const connString = process.env.DBCONN_STRING;
    const client = new MongoClient(connString);

    await client.connect();
    const db = client.db("codingtest");
    const collection = db.collection("items");
    
    const list = await collection.find({}).toArray();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: list,
        contentType: 'application/json'
    };
}