from flask import Blueprint, request, jsonify
from models.risk_model import risk_model

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/evaluate', methods=['POST'])
def evaluate():
    """
    Evaluate breast cancer risk based on questionnaire answers.
    
    Expected JSON body:
    {
        "age": 45,
        "family_first_degree": true,
        "family_second_degree": false,
        "family_bilateral": false,
        "previous_breast_issue": false,
        "atypical_hyperplasia": false,
        "prior_biopsy": false,
        "menarche_early": true,
        "menopause_late": false,
        "nulliparous": false,
        "first_birth_late": false,
        "hrt_use": false,
        "alcohol_use": true,
        "overweight_postmeno": false,
        "physical_inactivity": true,
        "smoking": false,
        "lump": false,
        "nipple_discharge": false,
        "skin_changes": false,
        "nipple_inversion": false,
        "breast_pain_persistent": false,
        "armpit_lump": false,
        "size_change": false
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate age
        age = data.get('age')
        if age is None or not isinstance(age, (int, float)) or age < 18 or age > 120:
            return jsonify({"error": "Valid age (18-120) is required"}), 400

        result = risk_model.calculate_risk(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@assessment_bp.route('/questions', methods=['GET'])
def get_questions():
    """Return the questionnaire structure in both languages."""
    lang = request.args.get('lang', 'both')

    questions = [
        {
            "id": "age",
            "type": "number",
            "section": "demographics",
            "section_label_en": "Personal Information",
            "section_label_ar": "المعلومات الشخصية",
            "label_en": "What is your age?",
            "label_ar": "كم عمركِ؟",
            "min": 18, "max": 100,
            "required": True
        },
        {
            "id": "family_first_degree",
            "type": "boolean",
            "section": "family_history",
            "section_label_en": "Family History",
            "section_label_ar": "التاريخ العائلي",
            "label_en": "Do you have a mother, sister, or daughter who has had breast cancer?",
            "label_ar": "هل لديكِ أم أو أخت أو ابنة مصابة بسرطان الثدي؟",
            "required": True
        },
        {
            "id": "family_second_degree",
            "type": "boolean",
            "section": "family_history",
            "section_label_en": "Family History",
            "section_label_ar": "التاريخ العائلي",
            "label_en": "Do you have a grandmother, aunt, or cousin who has had breast cancer?",
            "label_ar": "هل لديكِ جدة أو خالة أو عمة مصابة بسرطان الثدي؟",
            "required": True
        },
        {
            "id": "family_bilateral",
            "type": "boolean",
            "section": "family_history",
            "section_label_en": "Family History",
            "section_label_ar": "التاريخ العائلي",
            "label_en": "Has any family member had breast cancer in both breasts?",
            "label_ar": "هل أُصيبت أيٌّ من أفراد عائلتكِ بسرطان الثدي في كلا الثديين؟",
            "required": True
        },
        {
            "id": "previous_breast_issue",
            "type": "boolean",
            "section": "personal_history",
            "section_label_en": "Personal Medical History",
            "section_label_ar": "التاريخ الطبي الشخصي",
            "label_en": "Have you previously had any breast problem or condition?",
            "label_ar": "هل سبق أن عانيتِ من أي مشكلة أو حالة في الثدي؟",
            "required": True
        },
        {
            "id": "atypical_hyperplasia",
            "type": "boolean",
            "section": "personal_history",
            "section_label_en": "Personal Medical History",
            "section_label_ar": "التاريخ الطبي الشخصي",
            "label_en": "Have you ever been diagnosed with atypical hyperplasia (abnormal cells in breast tissue)?",
            "label_ar": "هل تم تشخيصكِ بفرط التنسج اللانمطي (خلايا غير طبيعية في نسيج الثدي)؟",
            "required": True
        },
        {
            "id": "prior_biopsy",
            "type": "boolean",
            "section": "personal_history",
            "section_label_en": "Personal Medical History",
            "section_label_ar": "التاريخ الطبي الشخصي",
            "label_en": "Have you ever had a breast biopsy?",
            "label_ar": "هل أجريتِ خزعة للثدي من قبل؟",
            "required": True
        },
        {
            "id": "menarche_early",
            "type": "boolean",
            "section": "reproductive",
            "section_label_en": "Reproductive History",
            "section_label_ar": "التاريخ الإنجابي",
            "label_en": "Did your menstrual period start before age 12?",
            "label_ar": "هل بدأت دورتكِ الشهرية قبل سن 12؟",
            "required": True
        },
        {
            "id": "menopause_late",
            "type": "boolean",
            "section": "reproductive",
            "section_label_en": "Reproductive History",
            "section_label_ar": "التاريخ الإنجابي",
            "label_en": "Did you enter menopause after age 55?",
            "label_ar": "هل دخلتِ سن اليأس بعد سن 55؟",
            "required": True
        },
        {
            "id": "nulliparous",
            "type": "boolean",
            "section": "reproductive",
            "section_label_en": "Reproductive History",
            "section_label_ar": "التاريخ الإنجابي",
            "label_en": "Have you never been pregnant?",
            "label_ar": "هل لم تحملي أبدًا؟",
            "required": True
        },
        {
            "id": "first_birth_late",
            "type": "boolean",
            "section": "reproductive",
            "section_label_en": "Reproductive History",
            "section_label_ar": "التاريخ الإنجابي",
            "label_en": "Was your first pregnancy after age 30?",
            "label_ar": "هل كان أول حمل لكِ بعد سن 30؟",
            "required": False
        },
        {
            "id": "hrt_use",
            "type": "boolean",
            "section": "reproductive",
            "section_label_en": "Reproductive History",
            "section_label_ar": "التاريخ الإنجابي",
            "label_en": "Are you currently using or have you used hormone replacement therapy (HRT)?",
            "label_ar": "هل تستخدمين أو استخدمتِ العلاج بالهرمونات البديلة؟",
            "required": True
        },
        {
            "id": "alcohol_use",
            "type": "boolean",
            "section": "lifestyle",
            "section_label_en": "Lifestyle Factors",
            "section_label_ar": "عوامل نمط الحياة",
            "label_en": "Do you regularly consume alcohol?",
            "label_ar": "هل تتناولين الكحول بانتظام؟",
            "required": True
        },
        {
            "id": "overweight_postmeno",
            "type": "boolean",
            "section": "lifestyle",
            "section_label_en": "Lifestyle Factors",
            "section_label_ar": "عوامل نمط الحياة",
            "label_en": "Are you overweight or obese (especially after menopause)?",
            "label_ar": "هل تعانين من زيادة الوزن أو السمنة (خاصةً بعد انقطاع الطمث)؟",
            "required": True
        },
        {
            "id": "physical_inactivity",
            "type": "boolean",
            "section": "lifestyle",
            "section_label_en": "Lifestyle Factors",
            "section_label_ar": "عوامل نمط الحياة",
            "label_en": "Are you physically inactive (less than 150 minutes of exercise per week)?",
            "label_ar": "هل أنتِ غير نشيطة جسديًا (أقل من 150 دقيقة تمرين في الأسبوع)؟",
            "required": True
        },
        {
            "id": "smoking",
            "type": "boolean",
            "section": "lifestyle",
            "section_label_en": "Lifestyle Factors",
            "section_label_ar": "عوامل نمط الحياة",
            "label_en": "Do you smoke or have you smoked?",
            "label_ar": "هل تدخنين أو كنتِ تدخنين؟",
            "required": True
        },
        {
            "id": "lump",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Have you noticed a lump or thickening in your breast or underarm?",
            "label_ar": "هل لاحظتِ كتلة أو سُمكًا غير طبيعي في ثديكِ أو الإبط؟",
            "required": True
        },
        {
            "id": "nipple_discharge",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Do you have any nipple discharge (other than breast milk)?",
            "label_ar": "هل تعانين من إفرازات من الحلمة (غير حليب الثدي)؟",
            "required": True
        },
        {
            "id": "skin_changes",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Have you noticed any skin changes on your breast (redness, dimpling, puckering)?",
            "label_ar": "هل لاحظتِ تغيرات في جلد الثدي (احمرار، تجعد، تقعر)؟",
            "required": True
        },
        {
            "id": "nipple_inversion",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Has your nipple recently turned inward (inverted)?",
            "label_ar": "هل انقلبت حلمتكِ للداخل مؤخرًا؟",
            "required": True
        },
        {
            "id": "breast_pain_persistent",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Do you have persistent, unexplained pain in your breast or armpit?",
            "label_ar": "هل تعانين من ألم مستمر وغير مفسر في الثدي أو الإبط؟",
            "required": True
        },
        {
            "id": "armpit_lump",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Have you noticed a lump or swelling in your armpit?",
            "label_ar": "هل لاحظتِ كتلة أو تورمًا في الإبط؟",
            "required": True
        },
        {
            "id": "size_change",
            "type": "boolean",
            "section": "symptoms",
            "section_label_en": "Current Symptoms",
            "section_label_ar": "الأعراض الحالية",
            "label_en": "Have you noticed a change in the size or shape of your breast?",
            "label_ar": "هل لاحظتِ تغيرًا في حجم أو شكل ثديكِ؟",
            "required": True
        }
    ]

    return jsonify({"questions": questions}), 200


# ── Lab Results endpoint (also accessible under /api/assessment/lab-results) ──
from models.risk_model import risk_model as _risk_model

@assessment_bp.route('/lab-results', methods=['POST'])
def lab_results_proxy():
    """Proxy to lab analysis — also accessible at /api/assessment/lab-results"""
    from routes.lab import analyze_lab
    from flask import current_app
    with current_app.test_request_context(
        '/api/lab/analyze',
        method='POST',
        data=request.get_data(),
        content_type='application/json'
    ):
        # Re-import and call directly
        pass
    # Just call the logic inline
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        REFERENCE_RANGES = {
            'ca153':  {'min': None, 'max': 31.3,  'weight_high': 40, 'name': 'CA 15-3'},
            'cea':    {'min': None, 'max': 5.0,   'weight_high': 30, 'name': 'CEA'},
            'wbc':    {'min': 4.5,  'max': 11.0,  'weight_high': 10, 'weight_low': 10, 'name': 'WBC'},
            'rbc':    {'min': 4.2,  'max': 5.4,   'weight_high': 5,  'weight_low': 15, 'name': 'RBC'},
            'hgb':    {'min': 12.0, 'max': 16.0,  'weight_high': 5,  'weight_low': 20, 'name': 'Hemoglobin'},
            'plt':    {'min': 150,  'max': 400,   'weight_high': 10, 'weight_low': 10, 'name': 'Platelets'},
        }

        total_score = 0
        findings_en = []
        findings_ar = []
        abnormal_markers = []

        for marker_id, ref in REFERENCE_RANGES.items():
            if marker_id in data:
                val = float(data[marker_id])
                status = 'normal'
                score = 0
                if ref['min'] is not None and val < ref['min']:
                    status = 'low'; score = ref.get('weight_low', 10)
                elif val > ref['max']:
                    status = 'high'; score = ref.get('weight_high', 20)
                total_score += score
                if status != 'normal':
                    abnormal_markers.append(marker_id)
                    if marker_id == 'ca153' and status == 'high':
                        findings_en.append(f"CA 15-3 is elevated ({val} U/mL) — primary breast cancer marker. Further investigation warranted.")
                        findings_ar.append(f"CA 15-3 مرتفع ({val} U/mL) — المؤشر الرئيسي لسرطان الثدي. يستوجب مزيدًا من الفحوصات.")
                    elif marker_id == 'cea' and status == 'high':
                        findings_en.append(f"CEA is elevated ({val} ng/mL). Clinical evaluation recommended.")
                        findings_ar.append(f"CEA مرتفع ({val} ng/mL). يُوصى بالتقييم السريري.")
                    elif marker_id == 'hgb' and status == 'low':
                        findings_en.append(f"Hemoglobin is low ({val} g/dL) — anemia present, warrants evaluation.")
                        findings_ar.append(f"الهيموجلوبين منخفض ({val} g/dL) — يوجد فقر دم يستوجب التقييم.")

        if not findings_en:
            findings_en.append("All provided markers are within normal reference ranges.")
            findings_ar.append("جميع المؤشرات المقدمة ضمن نطاقات المرجع الطبيعية.")

        capped = min(total_score, 100)
        ca_high = 'ca153' in abnormal_markers
        cea_high = 'cea' in abnormal_markers

        if ca_high or capped >= 55:
            risk_level = 'high'; color = '#e63946'
            label_en = 'Elevated Concern'; label_ar = 'مصدر قلق مرتفع'
            recs_en = ["Consult your doctor immediately regarding your CA 15-3 result.", "Request a full breast examination.", "Do not panic — only a doctor can provide a definitive interpretation."]
            recs_ar = ["استشيري طبيبك فورًا بشأن نتيجة CA 15-3.", "اطلبي فحصًا كاملاً للثدي.", "لا تقلقي — طبيبك وحده يستطيع التفسير النهائي."]
        elif cea_high or capped >= 25:
            risk_level = 'moderate'; color = '#f4a261'
            label_en = 'Moderate — Follow Up'; label_ar = 'متوسط — تابعي'
            recs_en = ["Schedule a doctor appointment to discuss these results.", "Bring your complete lab report.", "Continue regular breast self-exams."]
            recs_ar = ["احجزي موعدًا لمناقشة هذه النتائج.", "أحضري تقرير المختبر الكامل.", "استمري في الفحص الذاتي الشهري."]
        else:
            risk_level = 'low'; color = '#2a9d8f'
            label_en = 'Within Normal Range'; label_ar = 'ضمن النطاق الطبيعي'
            recs_en = ["Results are within normal ranges.", "Continue regular annual mammography.", "Perform monthly breast self-exams.", "Complete the full symptom risk assessment for a comprehensive picture."]
            recs_ar = ["النتائج ضمن النطاقات الطبيعية.", "استمري في الماموجرام السنوي.", "أجري الفحص الذاتي الشهري.", "أكملي تقييم الأعراض الكامل للحصول على صورة أشمل."]

        return jsonify({
            "score": capped, "risk_level": risk_level,
            "risk_level_label_en": label_en, "risk_level_label_ar": label_ar,
            "color": color,
            "findings_en": findings_en, "findings_ar": findings_ar,
            "recommendations_en": recs_en, "recommendations_ar": recs_ar,
            "disclaimer_en": "For educational awareness only. Not a medical diagnosis. Consult your doctor.",
            "disclaimer_ar": "لأغراض التوعية فقط. ليس تشخيصًا طبيًا. استشيري طبيبك."
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
