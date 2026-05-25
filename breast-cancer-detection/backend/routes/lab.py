"""
Lab Results Analysis Route
Analyzes blood tumor markers: CA 15-3, CEA, CBC values
"""
from flask import Blueprint, request, jsonify

lab_bp = Blueprint('lab', __name__)

# Reference ranges based on clinical standards
REFERENCE_RANGES = {
    'ca153':  {'min': None, 'max': 31.3,  'unit': 'U/mL',       'weight_high': 40, 'name': 'CA 15-3'},
    'cea':    {'min': None, 'max': 5.0,   'unit': 'ng/mL',      'weight_high': 30, 'name': 'CEA'},
    'wbc':    {'min': 4.5,  'max': 11.0,  'unit': '×10³/µL',    'weight_high': 10, 'weight_low': 10, 'name': 'WBC'},
    'rbc':    {'min': 4.2,  'max': 5.4,   'unit': '×10⁶/µL',    'weight_high': 5,  'weight_low': 15, 'name': 'RBC'},
    'hgb':    {'min': 12.0, 'max': 16.0,  'unit': 'g/dL',       'weight_high': 5,  'weight_low': 20, 'name': 'Hemoglobin'},
    'plt':    {'min': 150,  'max': 400,   'unit': '×10³/µL',    'weight_high': 10, 'weight_low': 10, 'name': 'Platelets'},
}


def analyze_marker(marker_id, value):
    ref = REFERENCE_RANGES[marker_id]
    score = 0
    status = 'normal'

    if ref['min'] is not None and value < ref['min']:
        status = 'low'
        score = ref.get('weight_low', 10)
    elif value > ref['max']:
        status = 'high'
        score = ref.get('weight_high', 20)

    return status, score


@lab_bp.route('/analyze', methods=['POST'])
def analyze_lab():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        total_score = 0
        findings_en = []
        findings_ar = []
        abnormal_markers = []
        results_breakdown = {}

        for marker_id, ref in REFERENCE_RANGES.items():
            if marker_id in data:
                val = float(data[marker_id])
                status, score = analyze_marker(marker_id, val)
                total_score += score
                results_breakdown[marker_id] = {'value': val, 'status': status, 'score': score}

                if status == 'high':
                    abnormal_markers.append(marker_id)
                    if marker_id == 'ca153':
                        findings_en.append(f"CA 15-3 is elevated ({val} U/mL). This is the primary breast cancer tumor marker — elevated levels warrant further investigation.")
                        findings_ar.append(f"CA 15-3 مرتفع ({val} U/mL). هذا هو المؤشر الرئيسي لسرطان الثدي — تستوجب المستويات المرتفعة مزيدًا من الفحوصات.")
                    elif marker_id == 'cea':
                        findings_en.append(f"CEA is elevated ({val} ng/mL). While not specific to breast cancer, elevated CEA requires clinical evaluation.")
                        findings_ar.append(f"CEA مرتفع ({val} ng/mL). وإن لم يكن خاصًا بسرطان الثدي، فإن ارتفاع CEA يستلزم التقييم السريري.")
                    elif marker_id == 'wbc':
                        findings_en.append(f"WBC is elevated ({val} ×10³/µL). Could indicate infection, inflammation, or immune response.")
                        findings_ar.append(f"WBC مرتفع ({val} ×10³/µL). قد يشير إلى عدوى أو التهاب أو استجابة مناعية.")
                    elif marker_id == 'plt':
                        findings_en.append(f"Platelets are elevated ({val} ×10³/µL). Can be associated with malignancy.")
                        findings_ar.append(f"الصفائح الدموية مرتفعة ({val} ×10³/µL). يمكن أن يرتبط بالأورام الخبيثة.")

                elif status == 'low':
                    abnormal_markers.append(marker_id)
                    if marker_id == 'hgb':
                        findings_en.append(f"Hemoglobin is low ({val} g/dL). Anemia is common in breast cancer and should be evaluated.")
                        findings_ar.append(f"الهيموجلوبين منخفض ({val} g/dL). فقر الدم شائع في سرطان الثدي ويجب تقييمه.")
                    elif marker_id == 'rbc':
                        findings_en.append(f"RBC count is low ({val} ×10⁶/µL). May indicate anemia requiring further assessment.")
                        findings_ar.append(f"عدد كريات الدم الحمراء منخفض ({val} ×10⁶/µL). قد يشير إلى فقر دم يستلزم مزيدًا من التقييم.")
                    elif marker_id == 'wbc':
                        findings_en.append(f"WBC is low ({val} ×10³/µL). May indicate bone marrow suppression.")
                        findings_ar.append(f"WBC منخفض ({val} ×10³/µL). قد يشير إلى تثبيط نخاع العظم.")
                    elif marker_id == 'plt':
                        findings_en.append(f"Platelets are low ({val} ×10³/µL). Thrombocytopenia can be associated with cancer treatment.")
                        findings_ar.append(f"الصفائح الدموية منخفضة ({val} ×10³/µL). قلة الصفيحات يمكن أن ترتبط بعلاج السرطان.")

        if not findings_en:
            findings_en.append("All provided markers are within normal reference ranges.")
            findings_ar.append("جميع المؤشرات المقدمة ضمن نطاقات المرجع الطبيعية.")

        # Determine risk level
        capped_score = min(total_score, 100)
        ca153_high = 'ca153' in abnormal_markers and results_breakdown.get('ca153', {}).get('status') == 'high'
        cea_high = 'cea' in abnormal_markers and results_breakdown.get('cea', {}).get('status') == 'high'

        if ca153_high or capped_score >= 55:
            risk_level = 'high'
            color = '#e63946'
            label_en = '🔴 Elevated Concern — See Doctor Promptly'
            label_ar = '🔴 مصدر قلق مرتفع — راجعي الطبيب فورًا'
        elif cea_high or capped_score >= 25:
            risk_level = 'moderate'
            color = '#f4a261'
            label_en = '🟡 Moderate — Follow Up Recommended'
            label_ar = '🟡 متوسط — يُنصح بالمتابعة'
        else:
            risk_level = 'low'
            color = '#2a9d8f'
            label_en = '🟢 Within Normal Range'
            label_ar = '🟢 ضمن النطاق الطبيعي'

        recs_en, recs_ar = _get_lab_recommendations(risk_level, ca153_high, cea_high)

        return jsonify({
            "score": capped_score,
            "risk_level": risk_level,
            "risk_level_label_en": label_en,
            "risk_level_label_ar": label_ar,
            "color": color,
            "findings_en": findings_en,
            "findings_ar": findings_ar,
            "recommendations_en": recs_en,
            "recommendations_ar": recs_ar,
            "results_breakdown": results_breakdown,
            "disclaimer_en": "These results are interpreted for educational awareness only and do NOT constitute a medical diagnosis. Your doctor is the only qualified person to interpret your lab results.",
            "disclaimer_ar": "تُفسَّر هذه النتائج لأغراض التوعية التعليمية فقط ولا تُعدّ تشخيصًا طبيًا. طبيبك هو الشخص الوحيد المؤهل لتفسير نتائج مختبرك."
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def _get_lab_recommendations(risk_level, ca153_high, cea_high):
    if ca153_high:
        en = [
            "⚠️ Your CA 15-3 is elevated — this is the primary breast cancer marker. Please consult your doctor as soon as possible.",
            "Do not panic — CA 15-3 can be elevated due to other benign conditions. Your doctor will determine next steps.",
            "Request a full breast examination and possibly imaging (mammogram or ultrasound).",
            "Bring all your lab results to your doctor appointment.",
            "Consider combining this with our full symptom risk assessment."
        ]
        ar = [
            "⚠️ CA 15-3 مرتفع لديك — وهو المؤشر الرئيسي لسرطان الثدي. يرجى استشارة طبيبك في أقرب وقت ممكن.",
            "لا تقلقي — يمكن أن يرتفع CA 15-3 بسبب حالات حميدة أخرى. سيحدد طبيبك الخطوات التالية.",
            "اطلبي فحصًا كاملاً للثدي وربما تصويرًا (ماموجرام أو موجات فوق صوتية).",
            "أحضري جميع نتائج مختبرك إلى موعد طبيبك.",
            "فكري في الجمع بين هذا وتقييم مخاطر الأعراض الكامل لدينا."
        ]
    elif risk_level == 'moderate':
        en = [
            "Some of your markers show values outside the normal range.",
            "Schedule an appointment with your doctor to discuss these results.",
            "Bring a copy of your complete lab report to your appointment.",
            "Do not attempt to self-diagnose — only a doctor can interpret lab results in clinical context.",
            "Continue regular breast self-exams and screening."
        ]
        ar = [
            "بعض مؤشراتك تُظهر قيمًا خارج النطاق الطبيعي.",
            "احجزي موعدًا مع طبيبك لمناقشة هذه النتائج.",
            "أحضري نسخة من تقرير مختبرك الكامل إلى موعدك.",
            "لا تحاولي التشخيص الذاتي — طبيبك وحده يستطيع تفسير نتائج المختبر في السياق السريري.",
            "استمري في الفحص الذاتي الشهري للثدي والفحوصات الدورية."
        ]
    else:
        en = [
            "Your provided markers are within normal reference ranges — encouraging news!",
            "Normal labs do not completely rule out breast cancer — symptoms and clinical exam are equally important.",
            "Continue with regular annual mammography as recommended for your age.",
            "Perform monthly breast self-exams.",
            "Complete our full symptom risk assessment for a more comprehensive picture."
        ]
        ar = [
            "المؤشرات المقدمة ضمن نطاقات المرجع الطبيعية — أخبار مشجعة!",
            "النتائج الطبيعية لا تستبعد سرطان الثدي تمامًا — الأعراض والفحص السريري بالغا الأهمية أيضًا.",
            "استمري في الماموجرام السنوي الدوري حسب ما يوصي به طبيبك.",
            "أجري الفحص الذاتي الشهري للثدي.",
            "أكملي تقييم مخاطر الأعراض الكامل لدينا للحصول على صورة أشمل."
        ]
    return en, ar
