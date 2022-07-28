module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { MongoClient } = require("mongodb");
    const { v4:uuidv4 } = require("uuid");
    const connString = process.env.DBCONN_STRING;
    const client = new MongoClient(connString);

    await client.connect();
    const db = client.db("codingtest");
    const collection = db.collection("items");
    
    let data = { _id: uuidv4(), ...req.body, _owner: req.headers.user };
    await collection.insertOne(data);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data,
        contentType: 'application/json'
    };
}