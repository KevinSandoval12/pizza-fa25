// Import the express module
import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

// Create an instance of an Express application
const app = express();

app.set("view engine", "ejs");

// Enable static file serving
app.use(express.static("public"));

// allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

// create an array to store orders

// Allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

// Create an array to store orders
const orders = [];

// Define the port number where our server will listen
const PORT = 4001;

// app.get("/db-test", async (req, res) => {
//   try {
//     const [orders] = await pool.query("SELECT * FROM orders");
//     res.send(orders);
//   } catch (err) {
//     console.error("Database Error:", err);
//   }
// });

app.get("/admin", async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders");
    pool.query("SELECT * FROM orders ORDER BY timestamp DESC");
    res.send("admin", { orders });
  } catch (err) {
    console.error("Database Error:", err);
  }
});

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", (req, res) => {
  // Send a response to the client
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/confirm", (req, res) => {
  res.render("confirmation");
});

app.get("/admin", (req, res) => {
  res.render("admin", { orders });
  //   res.sendFile(`${import.meta.dirname}/views/admin.html`);
});

app.post("/submit-order", (req, res) => {
  const order = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    method: req.body.method,
    toppings: req.body.toppings,
    size: req.body.size,
    comment: req.body.comment,
    timestamp: new Date(),
  };
  //   res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
  console.log("Server is running at http://localhost:${PORT}");

  orders.push(order);

  res.render("confirmation", { orders });
});

// Start the server and make it listen on the port
// specified above
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
