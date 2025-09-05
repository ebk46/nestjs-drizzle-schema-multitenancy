-- Create a new user with CREATEDB privilege
CREATE USER developer WITH PASSWORD 'password' CREATEDB;

-- Create the new database
CREATE DATABASE nestjs_drizzle_multitenancy_db;

-- Assign ownership of the database to the developer user
ALTER DATABASE nestjs_drizzle_multitenancy_db OWNER TO developer;

-- Connect to the newly created database
\c nestjs_drizzle_multitenancy_db;

-- Set work_mem for the developer role
ALTER ROLE developer SET WORK_MEM TO '64MB';