# Project UAS FE
Bertemakan lifestyle dimana kami memutuskan untuk membuat sebuah website yang berisikan resep-resep makanan sehat. 


## Setup database di postgree SQL 
1. Install PG ADMIN 4 untuk postgree 
2. Buat connection database baru 
4. Buka query tool kemudian run query berikut
Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Update Tabel User
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
ALTER TABLE users
ADD COLUMN subscription VARCHAR(20) DEFAULT 'Basic';



Tabel blacklist_tokens
CREATE TABLE blacklist_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Tabel saved_recipes
CREATE TABLE saved_recipes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Tabel comments
CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    comment TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


Tabel message
CREATE TABLE message (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) NOT NULL, 
    message TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


## Cara Run Program
Cara menjalankan program :
1. pada terminal vs code run "npm install" 
2. untuk run angular bisa run "cd frontend" kemudian "npm install -g live-server" kemudian run "live-server"
3. setup env database pada file .env kemudian sesuaikan env dengan db masing-masing
4. untuk run backend bisa run "cd backend" kemudian run "nodemon server.js"



