
import { GeneralConfig } from './general';
import { ScoringConfig } from './scoring';
import { ResultConfig } from './results';
import { ExportConfig } from './exports';
import { EmailConfig } from './emails';
import { CertificateConfig } from './certificates';

export const ExamConfig = {
    fields: [
        // GeneralConfig,
        ScoringConfig,
        ResultConfig,
        ExportConfig,
        EmailConfig,
        CertificateConfig
    ]
}