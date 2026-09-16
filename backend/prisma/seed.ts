import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Configuration de l'adaptateur PostgreSQL pour Prisma
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@hotel.com',
      name: 'Administrateur',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Compte Administrateur créé avec succès :');
  console.log(`Email : ${admin.email}`);
  console.log(`Rôle : ${admin.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });