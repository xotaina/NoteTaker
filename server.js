const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const routes = require("./route");

// Set up configuration
dotenv.config();
if (dotenv.error) {
  throw new Error("Could not find .env file");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

// Set up routes
app.get("/index", (req, res) =>
  res.sendFile(path.resolve(__dirname, "public", "index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.resolve(__dirname, "public", "notes.html"))
);

// Set up API routes
app.use(routes);

// Start the server
app.listen(PORT, () =>
  console.log(`Server is listening at http://localhost:${PORT}`)
);
