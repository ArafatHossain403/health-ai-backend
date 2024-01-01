import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiabetesDiagnosisHistory } from '@prisma/client';
import { UserGuard } from 'src/guards/users.guard';
import { Request } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user/diagnose')
export class DiagnosisController {
  constructor(private readonly service: DiagnosisService) {}

  @UseGuards(UserGuard)
  @Post('diabetes')
  async diagnoseDiabetes(
    @Req() req: Request,
    @Body()
    data: {
      pregnancies: number;
      glucose: number;
      s_bp: number;
      d_bp: number;
      skin_thickness: number;
      insulin: number;
      height: number;
      weight: number;
    },
  ): Promise<DiabetesDiagnosisHistory> {
    const user = req['user'];
    return await this.service.diagnoseDiabetes(data, user);
  }

  @UseGuards(UserGuard)
  @Get('diabetes/history')
  async getAllDiabetesHistory(
    @Req() req: Request,
  ): Promise<DiabetesDiagnosisHistory[]> {
    const user = req['user'];
    return await this.service.getAllDiabetesHistoryByUserId(user);
  }
  // admin all diabetes data
  @UseGuards(AdminGuard)
  @Get('diabetes/history/all')
  async getAllUsersDiabetesHistory(): Promise<DiabetesDiagnosisHistory[]> {
    return await this.service.getAllUsersDiabetesHistory();
  }
}
