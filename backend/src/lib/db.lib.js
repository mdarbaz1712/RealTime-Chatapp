import mongoose from "mongoose";

const conn= async()=>{
    try{
        await mongoose.connect(process.env.mongodb_URI)
        console.log("Mongo DB Connected !!!")
    }
    catch(error){
        console.log("Not Connected to mongo DB !!!")
    }
}

export default conn