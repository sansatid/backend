const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

router.get("/users", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/user", (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];
  const verifyToken = jwt.verify(token, "erti45f9f92hf09fhij2jkb66ff");

  const sql =
    "SELECT id, username, age, email, address, contact FROM user WHERE id = ?";
  const params = [verifyToken.id];

  db.query(sql, params, (err, result) => {
    if (err) next(err);

    const data = {
      success: true,
      message: "Get user success",
      data: result[0],
    };

    res.send(data);
  });
});

router.post("/user", (req, res) => {
  const { username, password, age } = req.body;

  const sql = "INSERT INTO user(username, password, age) VALUES(?, ?, ?)";
  const params = [username, password, age];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.send("Insert success!");
  });
});

router.post("/register", (req, res) => {
  const { username } = req.body;

  db.query(
    "SELECT * FROM user WHERE username = ? ",
    username,
    (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        res.send("user already exited");
      } else {
        const { username, password, age } = req.body;

        const sql =
          "INSERT INTO user (username, password, age) VALUES (?, ?, ?)";
        const params = [username, password, age];

        db.query(sql, params, (err, result) => {
          if (err) {
            console.error(err);
            res.send("Fail to register");
          } else {
            res.send("Create user success");
          }
        });
      }
    }
  );
});

router.put("/user", (req, res, next) => {
  const { username, age, email, address, contact } = req.body;

  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];
  const verifyToken = jwt.verify(token, "erti45f9f92hf09fhij2jkb66ff");

  const sql =
    "UPDATE user SET username = ?, age = ?, email = ?, address = ?, contact = ? WHERE id = ?";
  const params = [username, age, email, address, contact, verifyToken.id];

  db.query(sql, params, (err, result) => {
    if (err) next(err);

    const getUserSql =
      "SELECT id, username, age, email, address, contact FROM user WHERE id = ?";
    const getUserParams = [verifyToken.id];

    db.query(getUserSql, getUserParams, (err, result) => {
      if (err) next(err);

      const data = {
        success: true,
        message: "Update user success",
        data: result[0],
      };

      res.send(data);
    });
  });
});

router.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  const sql = " DELETE FROM user WHERE id = ?";
  const params = [id];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.send("Delete success!");
  });
});
router.use(errorHandler);

module.exports = router;
