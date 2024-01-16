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
    try {
        const data = await userModel.find({})    
        res.status(200).json( data )

    } catch (err) {
        res.status(500).json( {message: 'server error'} )
    }
})

//create data // save data
app.post("/create", async(req,res)=>{
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.status(200).json({ message : "data create successfully"})
})

//update
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { id,...rest} = req.body

    console.log(rest)
    const data = await userModel.updateOne({_id: id},rest)
    res.status(200).json({ message : "data update successfully"})
})


//delete
app.delete("/delete/:id", async(req,res)=>{
    const id = req.params.id
    await userModel.deleteOne({_id : id })
    res.status(200).json({ message : "data delete successfully"})

})


//getSingle
app.get("/tours/:id", async(req,res)=>{

    try {
        const id = req.params.id;
        const data = await userModel.findOne({_id:id}) 
        res.status(200).json( data )

    } catch (err) {
        res.status(500).json( {message: 'server error'} )
    }
    // const id = req.params.id
    // const data = await userModel.findOne({_id:id})
    // res.json({success : true, message: "successfully", data})
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
