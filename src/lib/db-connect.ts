import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject = {}

export default async function dbConnection():Promise<void>{
    try {
        if(connection.isConnected){
            console.log("Databse Already Connected");
            return
        }

        console.log(process.env.MONGODB_URI)

        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_USERNAME}` || "")

        connection.isConnected = db.connections[0].readyState

        console.log("Databse connection successfully !!!!");

        const databaseConnection = mongoose.connection

        databaseConnection.on("connected",()=>{
        console.log("Databse connection successfully without error !!!!");
        })

        databaseConnection.on("error",(error)=>{
            console.log("Make sure db is up and running");
            console.error(error)
            // process.exit()
        })

    } catch (error) {
        console.log("Database connection failed");
        console.error(error)
        // process.exit()
    }
}