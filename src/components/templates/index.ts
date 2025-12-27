import TemplateClassic from './TemplateClassic';
import TemplateModern from './TemplateModern';
import TemplateMinimal from './TemplateMinimal';
import TemplateProfessional from './TemplateProfessional';
import TemplateCreative from './TemplateCreative';
import TemplateExecutive from './TemplateExecutive';
import TemplateCard from './TemplateCard';
import { TemplateId, TemplateProps } from '@/types/resume';

export const templateComponents: Record<TemplateId, React.FC<TemplateProps>> = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
  professional: TemplateProfessional,
  creative: TemplateCreative,
  executive: TemplateExecutive,
};

export {
  TemplateClassic,
  TemplateModern,
  TemplateMinimal,
  TemplateProfessional,
  TemplateCreative,
  TemplateExecutive,
  TemplateCard,
};
