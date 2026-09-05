/**
 * Automatically assesses pregnancy risk level based on common
 * obstetric risk factors. Returns 'high' if any factor is flagged,
 * otherwise 'low'.
 *
 * Factors considered:
 * - Age under 18 or 35+ (adolescent / advanced maternal age)
 * - Blood pressure at or above 140/90 (possible pre-eclampsia)
 * - Gravida 5+ (grand multipara)
 * - Height under 145cm (associated with cephalopelvic disproportion)
 * - BMI outside 18.5–30 range (underweight/obese)
 */
export function assessRiskLevel(input: {
  age?: number | null;
  bloodPressure?: string | null;
  gravida?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
}): { level: 'low' | 'high'; reasons: string[] } {
  const reasons: string[] = [];

  if (input.age != null) {
    if (input.age < 18) reasons.push('Age under 18 (adolescent pregnancy)');
    if (input.age >= 35) reasons.push('Age 35 or above (advanced maternal age)');
  }

  if (input.bloodPressure) {
    const match = input.bloodPressure.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) {
      const systolic = parseInt(match[1]);
      const diastolic = parseInt(match[2]);
      if (systolic >= 140 || diastolic >= 90) {
        reasons.push(`Elevated blood pressure (${input.bloodPressure})`);
      }
    }
  }

  if (input.gravida != null && input.gravida >= 5) {
    reasons.push('Gravida 5 or more (grand multipara)');
  }

  if (input.heightCm != null && input.heightCm > 0 && input.heightCm < 145) {
    reasons.push('Height under 145cm');
  }

  if (input.heightCm && input.weightKg) {
    const heightM = input.heightCm / 100;
    const bmi = input.weightKg / (heightM * heightM);
    if (bmi < 18.5) reasons.push(`Low BMI (${bmi.toFixed(1)}, underweight)`);
    if (bmi >= 30) reasons.push(`High BMI (${bmi.toFixed(1)}, obese)`);
  }

  return {
    level: reasons.length > 0 ? 'high' : 'low',
    reasons,
  };
}