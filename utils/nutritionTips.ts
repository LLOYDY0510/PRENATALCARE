/**
 * Calculates how many months pregnant someone is, based on their LMP
 * (Last Menstrual Period) and today's date.
 */
export function getPregnancyMonth(lmp: string | null): number | null {
  if (!lmp) return null;
  const lmpDate = new Date(lmp);
  if (isNaN(lmpDate.getTime())) return null;

  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;

  const month = Math.floor(diffDays / 30.4) + 1;
  return Math.min(month, 9);
}

export function getTrimester(month: number | null): '1st' | '2nd' | '3rd' | null {
  if (month == null) return null;
  if (month <= 3) return '1st';
  if (month <= 6) return '2nd';
  return '3rd';
}

const NUTRITION_TIPS: Record<number, string[]> = {
  1: [
    'Take folic acid supplements to support early neural development.',
    'Eat small, frequent meals if experiencing morning sickness.',
    'Avoid alcohol, smoking, and raw/undercooked foods.',
  ],
  2: [
    'Continue folic acid and start iron supplementation as advised.',
    'Include leafy greens (malunggay, kangkong) for iron and folate.',
    'Stay hydrated — at least 8 glasses of water daily.',
  ],
  3: [
    'Eat protein-rich foods (eggs, fish, legumes) to support organ development.',
    'Include calcium sources like milk, tokwa (tofu), and small fish (eaten with bones).',
    'Manage nausea with ginger tea and bland, easy-to-digest foods.',
  ],
  4: [
    'Increase caloric intake slightly as appetite returns.',
    'Focus on iron-rich foods to prevent anemia (liver, beans, dark greens).',
    'Include vitamin C-rich fruits to help iron absorption (citrus, guava).',
  ],
  5: [
    'Continue balanced meals with rice, vegetables, and protein at each meal.',
    'Snack on nuts and seeds for healthy fats and energy.',
    'Watch sodium intake to help manage swelling and blood pressure.',
  ],
  6: [
    'Eat fiber-rich foods (fruits, vegetables, whole grains) to prevent constipation.',
    'Continue calcium and iron supplementation as prescribed.',
    'Monitor weight gain and report unusual swelling to your midwife.',
  ],
  7: [
    'Increase protein and calcium for rapid fetal bone growth.',
    'Eat smaller, more frequent meals as the baby takes up more space.',
    'Continue prenatal vitamins and stay active with light walking.',
  ],
  8: [
    'Focus on omega-3 rich foods (fish like tilapia, bangus) for brain development.',
    'Keep meals nutrient-dense — every bite counts as space for food decreases.',
    'Rest well and avoid excessive salt to manage swelling.',
  ],
  9: [
    'Eat energy-sustaining foods to prepare for labor (whole grains, fruits).',
    'Stay well-hydrated and continue light, safe physical activity.',
    'Ensure adequate iron intake to prepare for blood loss during delivery.',
  ],
};

export function getNutritionTips(month: number | null): string[] {
  if (month == null) return [];
  return NUTRITION_TIPS[month] ?? [];
}