import * as bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('123456', 10);
console.log('🚀 ~ file: bcrypt.ts:4 ~ hash:', hash);
