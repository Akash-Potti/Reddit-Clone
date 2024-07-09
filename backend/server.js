const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "akash",
  password: "4477",
  database: "akash",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

app.use(bodyParser.json());
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const blacklist = new Set();
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      console.error("Error verifying JWT token:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Decoded user:", decoded);
    req.user = decoded;
    next();
  });
};

app.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error registering user");
      } else {
        const token = jwt.sign({ email }, "your_secret_key", {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ message: "User registered successfully", token });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error logging in");
      } else if (result.length === 0) {
        return res.status(401).send("Invalid email or password");
      } else {
        const user = result[0];
        const validPassword = await bcrypt.compare(
          password,
          user.hashed_password
        );
        if (validPassword) {
          const token = jwt.sign({ id: user.id, email }, "your_secret_key", {
            expiresIn: "1h",
          });
          res.status(200).json({ message: "Login successful", token });
        } else {
          res.status(401).send("Invalid email or password");
        }
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Error logging in");
  }
});

app.post("/auth/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    blacklist.add(token);
    res.status(200).send("Logout successful");
  } else {
    res.status(400).send("No token provided");
  }
});

app.post(
  "/subreddits",
  authMiddleware,
  upload.single("profileImage"),
  (req, res) => {
    const { name, description } = req.body;
    const profileImageUrl = req.file ? req.file.path : null;

    const sql =
      "INSERT INTO subreddits (name, description, profile_image_url) VALUES (?, ?, ?)";
    db.query(sql, [name, description, profileImageUrl], (err, result) => {
      if (err) {
        console.error("Error creating subreddit:", err);
        return res.status(500).send("Error creating subreddit");
      }
      res.status(200).json({
        message: "Subreddit created successfully",
        subredditId: result.insertId,
      });
    });
  }
);

app.get("/subreddits/search/:query", authMiddleware, (req, res) => {
  const { query } = req.params;
  const sql = "SELECT * FROM subreddits WHERE name LIKE ?";
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error searching subreddits");
    } else {
      res.status(200).json(result);
    }
  });
});
app.get("/subreddits/:name", authMiddleware, (req, res) => {
  const { name } = req.params;
  const sql = "SELECT * FROM subreddits WHERE name = ?";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching subreddit");
    } else if (result.length === 0) {
      return res.status(404).send("Subreddit not found");
    } else {
      res.status(200).json(result[0]);
    }
  });
});
app.post("/subreddits/:name/posts", authMiddleware, (req, res) => {
  const { name } = req.params;
  const { title, context, media_url } = req.body;
  const userId = req.user.id;

  //console.log("Received user ID:", userId);
  const findSubredditQuery = "SELECT id FROM subreddits WHERE name = ?";
  db.query(findSubredditQuery, [name], (err, results) => {
    if (err) {
      console.error("Error finding subreddit:", err);
      return res.status(500).send("Error finding subreddit");
    }

    if (results.length === 0) {
      return res.status(404).send("Subreddit not found");
    }

    const subredditId = results[0].id;

    const createPostQuery =
      "INSERT INTO posts (user_id, subreddits_id, title, context, media_url) VALUES (?, ?, ?, ?, ?)";
    db.query(
      createPostQuery,
      [userId, subredditId, title, context, media_url],
      (err, result) => {
        if (err) {
          console.error("Error creating post:", err);
          return res.status(500).send("Error creating post");
        }
        //console.log("Inserted post ID:", result.insertId);
        res.status(201).json({
          message: "Post created successfully",
          postId: result.insertId,
        });
      }
    );
  });
});

app.get("/subreddits/:name/posts", authMiddleware, (req, res) => {
  const { name } = req.params;

  const findSubredditQuery = "SELECT id FROM subreddits WHERE name = ?";
  db.query(findSubredditQuery, [name], (err, results) => {
    if (err) {
      console.error("Error finding subreddit:", err);
      return res.status(500).send("Error finding subreddit");
    }

    if (results.length === 0) {
      return res.status(404).send("Subreddit not found");
    }

    const subredditId = results[0].id;

    const getPostsQuery = "SELECT * FROM posts WHERE subreddits_id = ?";
    db.query(getPostsQuery, [subredditId], (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).send("Error fetching posts");
      }
      res.status(200).json(results);
    });
  });
});
app.get("/posts/:postId", authMiddleware, (req, res) => {
  const { postId } = req.params;

  const getPostQuery = "SELECT * FROM posts WHERE id = ?";
  db.query(getPostQuery, [postId], (err, results) => {
    if (err) {
      console.error("Error fetching post:", err);
      return res.status(500).send("Error fetching post");
    }
    if (results.length === 0) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(results[0]);
  });
});
app.post("/posts/:postId/comments", authMiddleware, (req, res) => {
  const { postId } = req.params;
  const { context } = req.body;
  const userId = req.user.id;

  const sql =
    "INSERT INTO comments (user_id, post_id, context) VALUES (?, ?, ?)";
  db.query(sql, [userId, postId, context], (err, result) => {
    if (err) {
      console.error("Error adding comment:", err);
      return res.status(500).send("Error adding comment");
    }
    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId,
    });
  });
});
app.get("/posts/:postId/comments", authMiddleware, (req, res) => {
  const { postId } = req.params;

  const sql = `
    SELECT comments.id, comments.context, comments.created_at, users.username
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
  `;
  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Error fetching comments");
    }
    res.status(200).json(results);
  });
});
app.post("/subreddits/:id/follow", authMiddleware, (req, res) => {
  const subredditId = req.params.id;
  const userId = req.user.id;

  const sql =
    "INSERT INTO subreddit_followers (user_id, subreddit_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP";
  db.query(sql, [userId, subredditId], (err, result) => {
    if (err) {
      console.error("Error following subreddit:", err);
      return res.status(500).send("Error following subreddit");
    }
    res.status(200).json({ message: "Followed subreddit successfully" });
  });
});
app.post("/sunreddits/:id/unfollow", authMiddleware, (req, res) => {
  const subredditId = req.params.id;
  const userId = req.user.id;

  const sql =
    "DELETE FROM subreddit_followers WHERE user_id = ? AND subreddit_id = ?";
  db.query(sql, [userId, subredditId], (err, result) => {
    if (err) {
      console.error("Error unfollowing subreddit:", err);
      return res.status(500).send("Error unfollowing subreddit");
    }
    res.status(200).json({ message: "Unfollowed subreddit successfully" });
  });
});
app.get("/subreddits/:id/follow-status", authMiddleware, (req, res) => {
  const subredditId = req.params.id;
  const userId = req.user.id;

  const sql =
    "SELECT * FROM subreddit_followers WHERE user_id = ? AND subreddit_id = ?";
  db.query(sql, [userId, subredditId], (err, results) => {
    if (err) {
      console.error("Error checking follow status:", err);
      return res.status(500).send("Error checking follow status");
    }
    const isFollowing = results.length > 0;
    res.status(200).json({ isFollowing });
  });
});
app.get("/user/feed", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT posts.*, subreddits.name AS subreddit_name
    FROM posts
    JOIN subreddit_followers ON posts.subreddits_id = subreddit_followers.subreddit_id
    JOIN subreddits ON posts.subreddits_id = subreddits.id
    WHERE subreddit_followers.user_id = ?
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user feed:", err);
      return res.status(500).send("Error fetching user feed");
    }
    res.status(200).json(results);
  });
});

app.get("/profile/posts", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM posts WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user posts:", err);
      return res.status(500).send("Error fetching user posts");
    }
    res.status(200).json(results);
  });
});

app.get("/auth/me", authMiddleware, (req, res) => {
  const email = req.user.email;

  const sql = "SELECT id, username, email FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error fetching user information:", err);
      return res.status(500).send("Error fetching user information");
    }
    if (result.length === 0) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(result[0]);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
