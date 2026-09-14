import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LanguageToolMatch, LanguageToolResponse } from '../interfaces/languagetool.interface';

@Injectable()
export class LanguageToolService {
  private readonly logger = new Logger(LanguageToolService.name);
  private readonly apiUrl = 'https://api.languagetool.org/v2/check';

  async checkText(text: string, language: string = 'uk'): Promise<readonly LanguageToolMatch[]> {
    try {
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('language', language);

      const response = await axios.post<LanguageToolResponse>(this.apiUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000,
      });

      return response.data?.matches || [];
    } catch (error) {
      this.logger.error(`LanguageTool API call failed, continuing with local engine: ${String(error)}`);
      return [];
    }
  }
}
