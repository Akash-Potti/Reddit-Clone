'User Table'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

'Subreddits Table'
CREATE TABLE subreddits(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
'Subreddit Followers Table'
CREATE TABLE subreddit_followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subreddit_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id),
    UNIQUE (user_id, subreddit_id)
);


'Posts Table'
CREATE TABLE posts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subreddits_id INT,
    title VARCHAR(100) NOT NULL,
    context TEXT,
    media_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(subreddits_id) REFERENCES subreddits(id)
)

'Comments Table'
CREATE TABLE comments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT,
    context TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
)
