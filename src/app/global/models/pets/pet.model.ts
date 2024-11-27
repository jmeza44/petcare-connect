export interface Pet {
  // Core Information
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  gender: string;
  size: string;
  birthdate: Date;
  backgroundStory: string;

  // Adoption Details
  adoptionRequirements: {
    experienceLevel: string;
    livingEnvironment: string;
  };

  // Personality & Traits
  personalityTraits: string[];
  trainingLevel: string;

  // Health & Medical
  medicalHistory: string;
  vaccinationStatus: string;

  // Media
  photos: string[];
}
