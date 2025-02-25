import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY="sk_test_51QvfApAgPg5z2xxzIySJlW85ozNThlSwM87clZZYK5oWOhSFH8B49qSQTeRJeahJjUFt5cKW3Eq39V9XSDueLkdm008ubGSRQM"

export default {
    JWT_SECRET,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
};
