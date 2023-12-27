import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiabetesDiagnosisHistory } from '@prisma/client';
import { UserGuard } from 'src/guards/users.guard';
import { Request } from 'express';

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
      bp: number;
      skin_thickness: number;
      insulin: number;
      height: number;
      weight: number;
    },
  ): Promise<DiabetesDiagnosisHistory> {
    const user = req['user'];
    return await this.service.diagnoseDiabetes(data, user);
  }
}
