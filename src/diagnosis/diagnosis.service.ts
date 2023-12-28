import { Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { User, Prisma, DiabetesDiagnosisHistory } from '@prisma/client';
import {
  calculateAgeInYears,
  calculateBMI,
  callFetcher,
  getMLServerBaseUrl,
} from 'src/helper/functions';

@Injectable()
export class DiagnosisService {
  constructor(private prisma: PrismaService) {}

  async diagnoseDiabetes(
    data: Partial<Prisma.DiabetesDiagnosisHistoryCreateInput>,
    user: User,
  ): Promise<DiabetesDiagnosisHistory> {
    data.age = calculateAgeInYears(user.birth_date);
    data.bmi = calculateBMI(data.height, data.weight);

    data.outcome = await this.predictDiabetesOutcome(data);

    return await this.prisma.diabetesDiagnosisHistory.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        pregnancies: data.pregnancies || 0,
        glucose: data.glucose,
        bp: data.bp,
        skin_thickness: data.skin_thickness,
        insulin: data.insulin,
        height: data.height,
        weight: data.weight,
        bmi: data.bmi,
        age: data.age,
        outcome: data.outcome,
      },
    });
  }

  async predictDiabetesOutcome(
    data: Partial<Prisma.DiabetesDiagnosisHistoryCreateInput>,
  ): Promise<number> {
    const ml_server_url = getMLServerBaseUrl();
    const payload_data = {
      features: [
        [
          data.pregnancies || 0,
          data.glucose,
          data.bp,
          data.skin_thickness,
          data.insulin,
          data.bmi,
          data.age,
        ],
      ],
    };

    const response = await callFetcher(
      ml_server_url,
      '/predict-diabetes',
      'post',
      payload_data,
    );
    if (response[0] != undefined) {
      return response[0];
    } else {
      console.error(response);
      throw new Error(response['application_error_message']);
    }
  }
}
