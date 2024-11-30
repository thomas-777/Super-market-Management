import mongoose from 'mongoose';

main().catch(err => console.log("cannot connect to db\n", err));

async function main(){
    const uri = process.env.MONGODB_URI 
    await mongoose.connect(uri);
    console.log("database connected");
}