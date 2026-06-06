const diseasesMap: Record<string, string> = {
  "Drug Reaction": "Réaction médicamenteuse",
  "Allergy": "Allergie",
  "Hypertension": "Hypertension",
  "Heart attack": "Crise cardiaque",
  "Psoriasis": "Psoriasis",
  "Chicken pox": "Varicelle",
  "Acne": "Acné",
  "Impetigo": "Impétigo",
  "Fungal infection": "Infection fongique",
  "Hypothyroidism": "Hypothyroïdie",
  "Diabetes": "Diabète",
  "Hypoglycemia": "Hypoglycémie",
  "Hyperthyroidism": "Hyperthyroïdie",
  "GERD": "Reflux gastro-œsophagien",
  "Peptic ulcer diseae": "Ulcère peptique",
  "Jaundice": "Jaunisse",
  "Dimorphic hemmorhoids(piles)": "Hémorroïdes dimorphiques",
  "Gastroenteritis": "Gastro-entérite",
  "Urinary tract infection": "Infection urinaire",
  "Chronic cholestasis": "Cholestase chronique",
  "hepatitis A": "Hépatite A",
  "Hepatitis B": "Hépatite B",
  "Hepatitis C": "Hépatite C",
  "Hepatitis E": "Hépatite E",
  "Hepatitis D": "Hépatite D",
  "Alcoholic hepatitis": "Hépatite alcoolique",
  "Malaria": "Paludisme",
  "Dengue": "Dengue",
  "Migraine": "Migraine",
  "Cervical spondylosis": "Spondylose cervicale",
  "Paralysis (brain hemorrhage)": "Paralysie (hémorragie cérébrale)",
  "AIDS": "SIDA",
  "(vertigo) Paroymsal  Positional Vertigo": "Vertige positionnel paroxystique",
  "Common Cold": "Rhume",
  "Typhoid": "Typhoïde",
  "Varicose veins": "Varices",
  "Bronchial Asthma": "Asthme bronchique",
  "Pneumonia": "Pneumonie",
  "Osteoarthristis": "Ostéoarthrite",
  "Arthritis": "Arthrite",
  "Tuberculosis": "Tuberculose"
};

const specialistsMap: Record<string, string> = {
  "Allergist": "Allergologue",
  "Cardiologist": "Cardiologue",
  "Dermatologist": "Dermatologue",
  "Endocrinologist": "Endocrinologue",
  "Gastroenterologist": "Gastro-entérologue",
  "Gynecologist": "Gynécologue",
  "Hepatologist": "Hépatologue",
  "hepatologist": "Hépatologue",
  "Internal Medcine": "Médecine interne",
  "Neurologist": "Neurologue",
  "Osteopathic": "Ostéopathe",
  "Otolaryngologist": "Oto-rhino-laryngologiste",
  "Pediatrician": "Pédiatre",
  "Phlebologist": "Phlébologue",
  "Pulmonologist": "Pneumologue",
  "Rheumatologists": "Rhumatologue",
  "Tuberculosis": "Spécialiste en tuberculose"
};

/**
 * Translates a disease name bidirectionally based on the target language.
 */
export function translateDisease(name: string | null | undefined, targetLang: string): string {
  if (!name) return "";
  const lang = targetLang.toLowerCase().split("-")[0];
  const normalizedName = name.trim();

  if (lang === "fr") {
    // If it's already a French value, return it
    const frValues = Object.values(diseasesMap);
    if (frValues.some(v => v.toLowerCase() === normalizedName.toLowerCase())) {
      const found = frValues.find(v => v.toLowerCase() === normalizedName.toLowerCase());
      return found || normalizedName;
    }
    // Otherwise look up the English key
    for (const [enKey, frValue] of Object.entries(diseasesMap)) {
      if (enKey.toLowerCase() === normalizedName.toLowerCase()) {
        return frValue;
      }
    }
    return normalizedName;
  } else {
    // targetLang is "en"
    // If it's already an English key, return it
    const enKeys = Object.keys(diseasesMap);
    if (enKeys.some(k => k.toLowerCase() === normalizedName.toLowerCase())) {
      const found = enKeys.find(k => k.toLowerCase() === normalizedName.toLowerCase());
      return found || normalizedName;
    }
    // Otherwise look up the French value to get English key
    for (const [enKey, frValue] of Object.entries(diseasesMap)) {
      if (frValue.toLowerCase() === normalizedName.toLowerCase()) {
        return enKey;
      }
    }
    return normalizedName;
  }
}

/**
 * Translates a specialist label bidirectionally based on the target language.
 */
export function translateSpecialist(name: string | null | undefined, targetLang: string): string {
  if (!name) return "Généraliste";
  const lang = targetLang.toLowerCase().split("-")[0];
  const normalizedName = name.trim();

  if (lang === "fr") {
    const frValues = Object.values(specialistsMap);
    if (frValues.some(v => v.toLowerCase() === normalizedName.toLowerCase())) {
      const found = frValues.find(v => v.toLowerCase() === normalizedName.toLowerCase());
      return found || normalizedName;
    }
    for (const [enKey, frValue] of Object.entries(specialistsMap)) {
      if (enKey.toLowerCase() === normalizedName.toLowerCase()) {
        return frValue;
      }
    }
    return normalizedName;
  } else {
    // targetLang is "en"
    const enKeys = Object.keys(specialistsMap);
    if (enKeys.some(k => k.toLowerCase() === normalizedName.toLowerCase())) {
      const found = enKeys.find(k => k.toLowerCase() === normalizedName.toLowerCase());
      return found || normalizedName;
    }
    for (const [enKey, frValue] of Object.entries(specialistsMap)) {
      if (frValue.toLowerCase() === normalizedName.toLowerCase()) {
        return enKey;
      }
    }
    return normalizedName;
  }
}
