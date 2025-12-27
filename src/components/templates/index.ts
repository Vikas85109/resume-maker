import TemplateClassic from './TemplateClassic';
import TemplateModern from './TemplateModern';
import TemplateMinimal from './TemplateMinimal';
import TemplateProfessional from './TemplateProfessional';
import TemplateCreative from './TemplateCreative';
import TemplateExecutive from './TemplateExecutive';
import TemplateTech from './TemplateTech';
import TemplateElegant from './TemplateElegant';
import TemplateBold from './TemplateBold';
import TemplateATS from './TemplateATS';
import TemplateCard from './TemplateCard';
import { TemplateId, TemplateProps } from '@/types/resume';

export const templateComponents: Record<TemplateId, React.FC<TemplateProps>> = {
  ats: TemplateATS,
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
  professional: TemplateProfessional,
  creative: TemplateCreative,
  executive: TemplateExecutive,
  tech: TemplateTech,
  elegant: TemplateElegant,
  bold: TemplateBold,
};

export {
  TemplateATS,
  TemplateClassic,
  TemplateModern,
  TemplateMinimal,
  TemplateProfessional,
  TemplateCreative,
  TemplateExecutive,
  TemplateTech,
  TemplateElegant,
  TemplateBold,
  TemplateCard,
};
