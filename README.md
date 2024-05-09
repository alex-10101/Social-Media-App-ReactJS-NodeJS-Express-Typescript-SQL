# Social Media Application

- Social media platform that allows users to log in, update their profile, create and share posts,
  and interact with others by following other users, commenting on posts, and liking other users’ posts.

- Project features a secure authorization system with JSON Web Tokens (JWTs) access and refresh tokens.

- Access tokens are stored in memory and hashed refresh tokens are stored in the database. The refresh
  tokens are securely sent to clients as http-only cookies.

- Application also features scheduled jobs to constantly monitor and remove the users’ dangerous file uploads.
