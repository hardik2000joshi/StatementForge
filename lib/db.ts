import {MongoClient} from 'mongodb'
const uri = process.env.MONGODB_URI as string;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
    console.error("MongoDB_URI is undefined");
    throw new Error("Missing environment variable: MONGODB_URI");
}

if (process.env.NODE_ENV === 'development') {
    // use global in dev to prevent hot-reload reconnections
    if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;
}
else {
    // Always create new client in production (vercel)
    client = new MongoClient(uri, options);
    clientPromise = client.connect();  
}

export default clientPromise;