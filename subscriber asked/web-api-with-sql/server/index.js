const express = require("express");
const cors = require("cors")
const pool = require("./db");

const port = 5000;
const app = express();

app.use(express.json());
app.use(cors())

// GET ALL
app.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const getAll = await client.query("SELECT * FROM demo;");
    res.status(200).send(getAll.rows);
  } catch (error) {
  } finally {
    client.release();
  }
});

// GET ONE
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const getAll = await client.query("SELECT * FROM demo WHERE id = $1", [id]);
    res.status(200).send(getAll.rows[0]);
  } catch (error) {
  } finally {
    client.release();
  }
});

// POST
app.post("/", async (req, res) => {
  const { name, mail } = req.body;
  const date = new Date();
  const client = await pool.connect();
  try {
    const newUser = await client.query(
      "INSERT INTO demo(name,mail,createdAt) VALUES($1,$2,$3) RETURNING *",
      [name, mail, date]
    );
    res.status(201).send(newUser.rows[0]);
  } catch (error) {
  } finally {
    client.release();
  }
});

// PUT
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, mail } = req.body;
  const client = await pool.connect();
  try {
    await client.query("UPDATE demo SET name = $1, mail = $2 WHERE id = $3", [
      name,
      mail,
      id,
    ]);
    res.status(200).send("successful update");
  } catch (error) {
  } finally {
    client.release();
  }
});

// DELETE
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
     await client.query("DELETE FROM demo WHERE id = $1", [id]);
    res.status(200).send("successful deleted");
  } catch (error) {
  } finally {
    client.release();
  }
});

app.listen(port, () => console.log(`server is running on ${port}`));
