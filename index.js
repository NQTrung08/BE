const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
//schema

mongoose.connect("mongodb+srv://quang05:quang123@cluster0.j5oyhc4.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("connect to DB")
        app.listen(PORT, () => console.log("server is running"))
    })
    .catch(() => console.log(err))

const schemaData = mongoose.Schema({
    title: String,
    city: String,
    address: String,
    distance: Number,
    price: Number,
    maxGroupSize: Number,
    desc: String,
    reviews: [{
        name: String,
        rating: Number,
    }],
    avgrating: Number,
    photo: String,
    featured: Boolean,
})

const userModel = mongoose.model("tour", schemaData)
//read
app.get("/tours", async(req, res) => {
    const data = await userModel.find({})    
    res.send( data )
})

//create data // save data
app.post("/create", async(req,res)=>{
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.send({
        success: true,
        message: "Sata save succesfully"
    })
})

//update
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { id,...rest} = req.body

    console.log(rest)
    const data = await userModel.updateOne({_id: id},rest)
    res.send({success : true, message : "data update successfully"})
})


//delete
app.delete("/delete/:id", async(req,res)=>{
    const id = req.params.id
    await userModel.deleteOne({_id : id })
    res.send({success : true, message : "data delete successfully"})

})


//getSingle
app.get("/getSingle/:id", async(req,res)=>{
    const id = req.params.id
    const data = await userModel.findOne({_id:id})
    res.send({success : true, message: "successfully"})
})

//search
app.get("/search/:city", async(req,res)=>{
    console.log(req.params.city);
    const cityName = req.params.city;

    try {
        const data = await userModel.find({ city: { $regex: cityName, $options: 'i' } }).limit(8);
        res.send(data);
        
    } catch (error) {
        console.error('Error searching data:', error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
})
