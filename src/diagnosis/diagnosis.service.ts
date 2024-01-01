import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { User, Prisma, DiabetesDiagnosisHistory } from '@prisma/client';
import {
  calculateAgeInYears,
  calculateBMI,
  calculateMeanBP,
  callFetcher,
  getMLServerBaseUrl,
  successResponse,
} from 'src/helper/functions';
import { MailService } from 'src/helper/mail.service';
import { ResponseModel } from 'src/helper/types';
import * as moment from 'moment';

@Injectable()
export class DiagnosisService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async diagnoseDiabetes(
    data: Partial<Prisma.DiabetesDiagnosisHistoryCreateInput>,
    user: User,
  ): Promise<DiabetesDiagnosisHistory> {
    data.age = calculateAgeInYears(user.birth_date);
    data.bmi = calculateBMI(data.height, data.weight);
    data.mbp = calculateMeanBP(data.s_bp, data.d_bp);

    data.outcome = await this.predictDiabetesOutcome(data);

    return await this.prisma.diabetesDiagnosisHistory.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        pregnancies: data.pregnancies || 0,
        glucose: data.glucose,
        s_bp: data.s_bp,
        d_bp: data.d_bp,
        mbp: data.mbp,
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
          data.mbp,
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

  async getAllDiabetesHistoryByUserId(
    user: User,
  ): Promise<DiabetesDiagnosisHistory[]> {
    const histories = await this.prisma.diabetesDiagnosisHistory.findMany({
      where: { user_id: user.id },
    });
    console.log(histories);
    return histories;
  }

  async getAllUsersDiabetesHistory(): Promise<DiabetesDiagnosisHistory[]> {
    return await this.prisma.diabetesDiagnosisHistory.findMany();
  }

  async sendDiabetesHistory(user: User, to: string): Promise<ResponseModel> {
    if (!to) {
      throw new BadRequestException('To Email Address missing');
    }

    const histories = await this.prisma.diabetesDiagnosisHistory.findMany({
      where: { user_id: user.id },
      take: 5,
      orderBy: [{ id: 'desc' }],
    });

    // if (!histories || !histories.length || histories[0].outcome != 1) {
    //   throw new BadRequestException('Invalid Mail Send Request');
    // }

    const html_content = this.processHtml(user, histories);
    await this.mailService.sendMail(
      'Diabetes Diagnosis Reports',
      [to],
      html_content,
    );
    return successResponse('Mail sent successfully');
  }

  processHtml(user: User, histories: DiabetesDiagnosisHistory[]): string {
    let html_content = `
    <p><b>Name</b>: ${user.name}</p>
    <p><b>Gender</b>: ${user.gender}</p>
    <p><b>Age</b>: ${calculateAgeInYears(user.birth_date)} yrs</p>

    <h4>Diabetes Diagnose History</h4>
    <table>
      <thead>
        <tr>
          ${user.gender == 'female' ? `<td>Pregnancies</td>` : ``}
          <td>Glucose (mg/dL)</td>
          <td>Systolic Blood Pressure</td>
          <td>Diastolic Blood Pressure</td>
          <td>Mean Blood Pressure</td>
          <td>Skin Thickness (mm)</td>
          <td>Insulin (µU/mL)</td>
          <td>Height (cm)</td>
          <td>Weight (kg)</td>
          <td>Result</td>
          <td>Created At</td>
        </tr>
      </thead> 

    <tbody>
    `;
    for (let i = 0; i < histories.length; i++) {
      const history = histories[i];
      html_content += `
        <tr>
          ${user.gender == 'female' ? `<td>${history.pregnancies}</td>` : ``}
          <td>${history.glucose}</td>
          <td>${history.s_bp}</td>
          <td>${history.d_bp}</td>
          <td>${history.mbp}</td>
          <td>${history.skin_thickness}</td> 
          <td>${history.insulin}</td> 
          <td>${history.height}</td>
          <td>${history.weight}</td>
          <td> Diabetes ${
            history.outcome == 1
              ? `<span style="color:red;">Positive</span>`
              : `<span style="color:green;">Negative</span>`
          }
          </td>
          <td>${moment(history.created_at).format('llll')}</td>
        </tr>`;
    }

    html_content += `
        </tbody>
      </table>`;

    return html_content;
  }
}
