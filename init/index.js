//const mongoose = require("mongoose");

//const initData = require("./data.js");
//const Listing = require("../models/listing.js")

import mongoose from "mongoose";
import { initData } from "./data.js"; 
import Listing from "../models/listing.js";

main()
  .then(()=>{
    console.log("running");
  })
  .catch((err)=> console.log(err));
  async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  }

  const initDB = async () => {
    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj) =>({ ...obj , owner:"691fe4f73e2e1a537864d658"}));
    await Listing.insertMany(initData.data);
    console.log("data was init");
  };

  initDB();

