require("dotenv").config()
const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index")

const app = express();

app.use(cors());

// CORS middleware — add this BEFORE routes
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   }));

app.use(express.json());  

app.use("/api/v1", rootRouter);

// app.post('/api/v1/',(req,res)=>{
//     res.json({
//         messsage: "done"
//     })
// })

app.listen(3000, () => {
    console.log(`the port is running on ${3000}`)
});