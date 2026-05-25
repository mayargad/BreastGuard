"""
Breast Cancer Risk Assessment Model
Uses evidence-based risk factors from medical literature (Gail Model inspired)
"""

class BreastCancerRiskModel:
    """
    Evidence-based risk scoring system for breast cancer awareness.
    Based on factors from:
    - The Gail Model (NCI)
    - BRCA risk factors
    - WHO breast cancer risk guidelines
    
    NOTE: This is for EDUCATIONAL/AWARENESS purposes only.
    It is NOT a medical diagnosis tool.
    """

    def __init__(self):
        # Risk weights based on epidemiological evidence
        self.risk_weights = {
            # Demographics
            'age_30_39': 5,
            'age_40_49': 15,
            'age_50_59': 20,
            'age_60_plus': 25,

            # Family history
            'family_first_degree': 25,
            'family_second_degree': 10,
            'family_bilateral': 15,

            # Personal history
            'previous_breast_issue': 20,
            'atypical_hyperplasia': 30,
            'prior_biopsy': 10,

            # Reproductive factors
            'menarche_early': 5,       # before 12
            'menopause_late': 5,       # after 55
            'nulliparous': 5,
            'first_birth_late': 10,    # after 30
            'hrt_use': 10,

            # Lifestyle
            'alcohol_use': 8,
            'overweight_postmeno': 10,
            'physical_inactivity': 5,
            'smoking': 5,

            # Symptoms (high weight - need immediate attention)
            'lump': 40,
            'nipple_discharge': 25,
            'skin_changes': 20,
            'nipple_inversion': 20,
            'breast_pain_persistent': 10,
            'armpit_lump': 30,
            'size_change': 15,
        }

    def calculate_risk(self, answers: dict) -> dict:
        """
        Calculate risk score from questionnaire answers.
        Returns risk level, score, recommendations.
        """
        score = 0
        contributing_factors = []

        # --- Age ---
        age = answers.get('age', 0)
        if 30 <= age <= 39:
            score += self.risk_weights['age_30_39']
            contributing_factors.append('age')
        elif 40 <= age <= 49:
            score += self.risk_weights['age_40_49']
            contributing_factors.append('age')
        elif 50 <= age <= 59:
            score += self.risk_weights['age_50_59']
            contributing_factors.append('age')
        elif age >= 60:
            score += self.risk_weights['age_60_plus']
            contributing_factors.append('age')

        # --- Family History ---
        if answers.get('family_first_degree'):
            score += self.risk_weights['family_first_degree']
            contributing_factors.append('family_first_degree')
        if answers.get('family_second_degree'):
            score += self.risk_weights['family_second_degree']
            contributing_factors.append('family_second_degree')
        if answers.get('family_bilateral'):
            score += self.risk_weights['family_bilateral']
            contributing_factors.append('family_bilateral')

        # --- Personal Medical History ---
        if answers.get('previous_breast_issue'):
            score += self.risk_weights['previous_breast_issue']
            contributing_factors.append('previous_breast_issue')
        if answers.get('atypical_hyperplasia'):
            score += self.risk_weights['atypical_hyperplasia']
            contributing_factors.append('atypical_hyperplasia')
        if answers.get('prior_biopsy'):
            score += self.risk_weights['prior_biopsy']
            contributing_factors.append('prior_biopsy')

        # --- Reproductive History ---
        if answers.get('menarche_early'):
            score += self.risk_weights['menarche_early']
            contributing_factors.append('menarche_early')
        if answers.get('menopause_late'):
            score += self.risk_weights['menopause_late']
            contributing_factors.append('menopause_late')
        if answers.get('nulliparous'):
            score += self.risk_weights['nulliparous']
            contributing_factors.append('nulliparous')
        if answers.get('first_birth_late'):
            score += self.risk_weights['first_birth_late']
            contributing_factors.append('first_birth_late')
        if answers.get('hrt_use'):
            score += self.risk_weights['hrt_use']
            contributing_factors.append('hrt_use')

        # --- Lifestyle ---
        if answers.get('alcohol_use'):
            score += self.risk_weights['alcohol_use']
            contributing_factors.append('alcohol_use')
        if answers.get('overweight_postmeno'):
            score += self.risk_weights['overweight_postmeno']
            contributing_factors.append('overweight_postmeno')
        if answers.get('physical_inactivity'):
            score += self.risk_weights['physical_inactivity']
            contributing_factors.append('physical_inactivity')
        if answers.get('smoking'):
            score += self.risk_weights['smoking']
            contributing_factors.append('smoking')

        # --- Current Symptoms (most critical) ---
        symptoms_present = []
        if answers.get('lump'):
            score += self.risk_weights['lump']
            contributing_factors.append('lump')
            symptoms_present.append('lump')
        if answers.get('nipple_discharge'):
            score += self.risk_weights['nipple_discharge']
            contributing_factors.append('nipple_discharge')
            symptoms_present.append('nipple_discharge')
        if answers.get('skin_changes'):
            score += self.risk_weights['skin_changes']
            contributing_factors.append('skin_changes')
            symptoms_present.append('skin_changes')
        if answers.get('nipple_inversion'):
            score += self.risk_weights['nipple_inversion']
            contributing_factors.append('nipple_inversion')
            symptoms_present.append('nipple_inversion')
        if answers.get('breast_pain_persistent'):
            score += self.risk_weights['breast_pain_persistent']
            contributing_factors.append('breast_pain_persistent')
            symptoms_present.append('breast_pain_persistent')
        if answers.get('armpit_lump'):
            score += self.risk_weights['armpit_lump']
            contributing_factors.append('armpit_lump')
            symptoms_present.append('armpit_lump')
        if answers.get('size_change'):
            score += self.risk_weights['size_change']
            contributing_factors.append('size_change')
            symptoms_present.append('size_change')

        # Determine risk level
        urgent = len(symptoms_present) > 0
        risk_level, color = self._get_risk_level(score, urgent)

        # Get recommendations
        recommendations_en, recommendations_ar = self._get_recommendations(risk_level, symptoms_present)

        return {
            "score": min(score, 100),  # cap at 100
            "risk_level": risk_level,
            "color": color,
            "urgent": urgent,
            "symptoms_present": symptoms_present,
            "contributing_factors": contributing_factors,
            "recommendations_en": recommendations_en,
            "recommendations_ar": recommendations_ar,
            "disclaimer_en": "This assessment is for educational awareness only and does NOT constitute a medical diagnosis. Please consult a qualified healthcare professional.",
            "disclaimer_ar": "هذا التقييم لأغراض التوعية فقط ولا يُعدّ تشخيصًا طبيًا. يُرجى استشارة طبيب مختص."
        }

    def _get_risk_level(self, score: int, urgent: bool) -> tuple:
        if urgent or score >= 60:
            return ("high", "#e63946")
        elif score >= 30:
            return ("moderate", "#f4a261")
        else:
            return ("low", "#2a9d8f")

    def _get_recommendations(self, risk_level: str, symptoms: list) -> tuple:
        if symptoms:
            en = [
                "⚠️ You reported physical symptoms that require IMMEDIATE medical attention.",
                "Please schedule an appointment with your doctor as soon as possible.",
                "Do not delay — early detection saves lives.",
                "Perform regular breast self-exams monthly.",
                "Discuss mammography screening with your doctor."
            ]
            ar = [
                "⚠️ لديكِ أعراض جسدية تستوجب مراجعة الطبيب فورًا.",
                "يُرجى حجز موعد مع طبيبك في أقرب وقت ممكن.",
                "لا تتأخري — الاكتشاف المبكر ينقذ الأرواح.",
                "أجري الفحص الذاتي للثدي بانتظام كل شهر.",
                "ناقشي مع طبيبك جدولة فحص الماموجرام."
            ]
        elif risk_level == "high":
            en = [
                "Your risk profile indicates elevated risk factors.",
                "Schedule a consultation with your doctor for professional screening.",
                "Consider genetic counseling if you have strong family history.",
                "Get annual mammography starting at age 40 (or earlier if recommended).",
                "Adopt a healthy lifestyle: limit alcohol, exercise regularly, maintain healthy weight.",
                "Perform monthly breast self-exams."
            ]
            ar = [
                "ملفك الصحي يُشير إلى عوامل خطر مرتفعة.",
                "احجزي موعدًا مع طبيبك لإجراء الفحوصات اللازمة.",
                "فكري في الاستشارة الجينية إذا كان لديك تاريخ عائلي قوي.",
                "أجري الماموجرام سنويًا ابتداءً من سن 40 (أو أبكر إذا أوصى طبيبك).",
                "اتبعي نمط حياة صحي: قللي من الكحول، مارسي الرياضة، حافظي على وزن صحي.",
                "أجري الفحص الذاتي الشهري للثدي."
            ]
        elif risk_level == "moderate":
            en = [
                "You have some risk factors that are worth monitoring.",
                "Discuss your risk profile with your doctor at your next visit.",
                "Schedule regular mammography as recommended for your age.",
                "Practice monthly breast self-examination.",
                "Maintain a healthy weight and stay physically active.",
                "Limit alcohol consumption."
            ]
            ar = [
                "لديك بعض عوامل الخطر التي تستحق المتابعة.",
                "ناقشي ملفك الصحي مع طبيبك في زيارتك القادمة.",
                "أجري الماموجرام بانتظام وفق ما يوصي به طبيبك.",
                "مارسي الفحص الذاتي الشهري للثدي.",
                "حافظي على وزن صحي وابقي نشيطة.",
                "قللي من تناول الكحول."
            ]
        else:
            en = [
                "Your current risk profile is relatively low — great news!",
                "Continue with regular breast self-exams every month.",
                "Schedule routine mammography as recommended for your age group.",
                "Maintain a healthy lifestyle to keep your risk low.",
                "Stay informed and aware of any changes in your body.",
                "Annual check-ups with your doctor are still important."
            ]
            ar = [
                "ملفك الصحي الحالي يُشير إلى خطر منخفض نسبيًا — هذه أخبار جيدة!",
                "استمري في الفحص الذاتي الشهري للثدي.",
                "أجري الماموجرام الدوري وفق ما يوصي به طبيبك.",
                "حافظي على نمط حياة صحي للإبقاء على خطرك منخفضًا.",
                "ابقي على وعي بأي تغييرات في جسدك.",
                "الفحوصات السنوية عند الطبيب لا تزال مهمة."
            ]

        return en, ar


risk_model = BreastCancerRiskModel()
