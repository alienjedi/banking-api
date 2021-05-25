import mongoose from "mongoose";

const DB_URL = "mongodb://127.0.0.1:27017/banking?retryWrites=true&w=majority";

const database = mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (error: any) => {
    if (error) throw error;
    console.log("Connected to db");
  }
);

export default database;
