module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { MongoClient } = require("mongodb");
    const { v4:uuidv4 } = require("uuid");
    const connString = process.env.DBCONN_STRING;
    const client = new MongoClient(connString);

    await client.connect();
    const db = client.db("codingtest");
    const collection = db.collection("items");

    let existing = await collection.findOne({ _id: req.params.id });

    // check to make sure it exists
    if (!existing) {
        return (context.res = {
            status: 400,
            body: { message: "not found" }
        })
    }

    // check for the owner
    if (existing._owner != req.headers.user) {
        return (context.res = {
            status: 401,
            body: { message: "not authorized" }
        })
    }

    // delete the item
    let remove = await collection.deleteOne({ _id: req.params.id });
    if (!remove) {
        return (context.res = {
            status: 500,
            body: { message: "error deleting" }
        })
    }
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: { message: "deleted" }
    };
}