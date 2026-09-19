import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // Configuration globale des variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Modules cœurs et fonctionnalités
    PrismaModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    BookingsModule,
    PaymentsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}