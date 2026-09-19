import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent')
  getRecentBookings() {
    return this.dashboardService.getRecentBookings();
  }
}