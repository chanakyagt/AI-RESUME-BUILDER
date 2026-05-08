export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  jobTitle: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  rawDescription: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  template: "modern" | "minimal" | "classic";
}

export const emptyResume: ResumeData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    jobTitle: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
    languages: [],
  },
  projects: [],
  certifications: [],
  template: "modern",
};
