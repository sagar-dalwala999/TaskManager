import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    const data = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("MongoDB host: ", data.connection.host);

  } catch (error) {
    console.log(error.message);
  }
};

export default DBConnection;
