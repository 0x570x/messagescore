CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_pro BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_shadow_banned BOOLEAN DEFAULT FALSE,
    risk_score INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS usage_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fingerprint VARCHAR(255),
    ip_address VARCHAR(45),
    session_id VARCHAR(255),
    message_type VARCHAR(100),
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    suspicious_flags JSONB
);

CREATE TABLE IF NOT EXISTS fingerprints (
    id SERIAL PRIMARY KEY,
    fingerprint_hash VARCHAR(255) UNIQUE NOT NULL,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    associated_ips TEXT[],
    associated_emails TEXT[],
    risk_score INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ip_tracking (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_logs_fingerprint ON usage_logs(fingerprint);
CREATE INDEX idx_usage_logs_ip ON usage_logs(ip_address);