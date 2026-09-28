import schoolsDataRaw from "@/data/schoolsData.json";

export interface SchoolsDataMap {
  [state: string]: {
    [city: string]: string[];
  };
}

export const schoolsData: SchoolsDataMap = schoolsDataRaw;

export function getAvailableStates(): string[] {
  return Object.keys(schoolsData).sort();
}

export function getCitiesForState(state: string): string[] {
  if (!state || !schoolsData[state]) return [];
  return Object.keys(schoolsData[state]).sort();
}

export function getSchoolsForCity(state: string, city: string): string[] {
  if (!state || !city || !schoolsData[state] || !schoolsData[state][city]) return [];
  return schoolsData[state][city];
}
