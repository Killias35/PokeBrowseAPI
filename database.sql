CREATE DATABASE IF NOT EXISTS pokemon_api;
USE pokemon_api;

-- =========================
-- SETTINGS
-- =========================

CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nb_pokemons INT NOT NULL DEFAULT 0
);

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image TEXT,
    username VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    identifiant VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- POKEMON
-- =========================

CREATE TABLE pokemon (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sprite VARCHAR(255),
    shiny VARCHAR(255),
    type1 VARCHAR(50),
    type2 VARCHAR(50),
    height FLOAT,
    weight FLOAT,
    rarity VARCHAR(50),
    sumStats INT,
    generation INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USER POKEMON (CAPTURES)
-- =========================

CREATE TABLE user_pokemon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,

    is_shiny BOOLEAN DEFAULT FALSE,
    domain_name VARCHAR(255),

    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- relations
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,

    -- index pour perf leaderboard
    INDEX idx_user (user_id),
    INDEX idx_pokemon (pokemon_id),
    INDEX idx_shiny (is_shiny),
    INDEX idx_domain (domain_name)
);

-- =========================
-- INDEXS BONUS (IMPORTANT PERF)
-- =========================

-- leaderboard unique pokemon
CREATE INDEX idx_user_pokemon_unique
ON user_pokemon (user_id, pokemon_id);

-- leaderboard total captures
CREATE INDEX idx_user_capture
ON user_pokemon (user_id);

-- leaderboard shiny
CREATE INDEX idx_user_shiny
ON user_pokemon (user_id, is_shiny);

-- =========================
-- SETTINGS INIT
-- =========================

INSERT INTO settings (nb_pokemons)
VALUES (151);

-- =========================
-- VIEW BONUS (OPTIONNEL MAIS TRÈS UTILE)
-- =========================

CREATE VIEW leaderboard_unique AS
SELECT
    u.id,
    u.username,
    COUNT(DISTINCT up.pokemon_id) AS score
FROM users u
LEFT JOIN user_pokemon up ON up.user_id = u.id
GROUP BY u.id;

CREATE VIEW leaderboard_total AS
SELECT
    u.id,
    u.username,
    COUNT(up.id) AS score
FROM users u
LEFT JOIN user_pokemon up ON up.user_id = u.id
GROUP BY u.id;

CREATE VIEW leaderboard_shiny AS
SELECT
    u.id,
    u.username,
    COUNT(up.id) AS score
FROM users u
LEFT JOIN user_pokemon up ON up.user_id = u.id
WHERE up.is_shiny = TRUE
GROUP BY u.id;
