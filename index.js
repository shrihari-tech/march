const express = require('express');
const app = express();
const PORT = 5000;
const userRoutes = require('./Routes/User');
const taskRoutes = require('./Routes/Task');
const mongoose = require('mongoose');

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/',(req,res)=>{
  res.send("Hello World");
});

app.use('/user', userRoutes);
app.use('/task', taskRoutes);



mongoose.connect('mongodb://localhost:27017/march')
.then(()=>{
  console.log("DB Connected");
})
.catch((err)=>{
  console.log(err);
})