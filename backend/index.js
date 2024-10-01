const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());
app.get("/products", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    res.json(response.data.products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
