require('dotenv').config();
const { execSync } = require('child_process');

console.log('Explicitly loading environment...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
    console.log('Running prisma generate...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Success!');
} catch (error) {
    console.error('Generation failed.');
    process.exit(1);
}
