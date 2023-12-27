import { Controller, Post, Body } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiabetesDiagnosisHistory, PrismaClient } from '@prisma/client';

@Controller('user/diagnose')
export class DiagnosisController {
  constructor(private readonly service: DiagnosisService) {}

  @Post('diabetes')
  async diagnoseDiabetes(
    @Body()
    data: {
      pregnancies: number;
      glucose: number;
      bp: number;
      skin_thickness: number;
      insulin: number;
      bmi: number;
      age: number;
    },
  ): Promise<DiabetesDiagnosisHistory> {
    const user = await new PrismaClient().user.findFirst();
    return await this.service.diagnoseDiabetes(data, user);
  }
}
