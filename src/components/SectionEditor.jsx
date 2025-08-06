import React from 'react'
import AccordionSection from './AccordionSection'
import PersonalDetailsSection from './PersonalDetailsSection'
import ProfileSection from './ProfileSection'
import EducationSection from './sections/EducationSection'
import EmploymentSection from './sections/EmploymentSection'
import SkillsSection from './sections/SkillsSection'
import LanguageSection from './sections/LanguageSection'
import HobbySection from './sections/HobbySection'

const SectionEditor = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded mt-8">
      <AccordionSection title="Personal details">
        <PersonalDetailsSection />
      </AccordionSection>

      <AccordionSection title="Profile">
        <ProfileSection/>
      </AccordionSection>

      <AccordionSection title="Education">
        <EducationSection/>
      </AccordionSection>

      <AccordionSection title="Employment">
        <EmploymentSection />
      </AccordionSection>

      <AccordionSection title="Skills">
        <SkillsSection/>
      </AccordionSection>

      <AccordionSection title="Language">
        <LanguageSection />
      </AccordionSection>

      <AccordionSection title="Hobby">
        <HobbySection />
      </AccordionSection>
    </div>
  )
}

export default SectionEditor