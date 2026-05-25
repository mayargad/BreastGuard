from flask import Blueprint, jsonify

info_bp = Blueprint('info', __name__)

@info_bp.route('/about', methods=['GET'])
def about():
    return jsonify({
        "title_en": "About Breast Cancer",
        "title_ar": "عن سرطان الثدي",
        "stats": {
            "global_cases_per_year": "2.3 million",
            "most_common_cancer": True,
            "survival_rate_early_detection": "99%",
            "survival_rate_late_detection": "27%"
        },
        "facts_en": [
            "Breast cancer is the most common cancer in women worldwide.",
            "Early detection dramatically improves survival rates — nearly 99% if caught early.",
            "Men can also get breast cancer, though it is rare.",
            "Regular screening and self-exams are your best defense.",
            "A healthy lifestyle can reduce your risk."
        ],
        "facts_ar": [
            "سرطان الثدي هو أكثر أنواع السرطان شيوعًا بين النساء في جميع أنحاء العالم.",
            "يُحسّن الاكتشاف المبكر بشكل كبير من معدلات النجاة — تصل إلى 99% عند اكتشافه مبكرًا.",
            "يمكن أن يُصاب الرجال أيضًا بسرطان الثدي، وإن كان ذلك نادرًا.",
            "الفحص المنتظم والفحص الذاتي هما خط دفاعكِ الأول.",
            "نمط الحياة الصحي يمكن أن يقلل من خطر الإصابة."
        ]
    })


@info_bp.route('/self-exam', methods=['GET'])
def self_exam():
    return jsonify({
        "title_en": "How to Perform a Breast Self-Exam",
        "title_ar": "كيفية إجراء الفحص الذاتي للثدي",
        "frequency_en": "Once a month, ideally a few days after your period ends",
        "frequency_ar": "مرة واحدة شهريًا، يُفضّل بعد أيام قليلة من انتهاء دورتكِ الشهرية",
        "steps_en": [
            {"step": 1, "title": "Visual Inspection", "detail": "Stand in front of a mirror with your shoulders straight and hands on hips. Look for any changes in size, shape, or color."},
            {"step": 2, "title": "Arms Raised", "detail": "Raise your arms and look for the same changes."},
            {"step": 3, "title": "Check for Discharge", "detail": "Look for signs of fluid from one or both nipples."},
            {"step": 4, "title": "Lying Down Exam", "detail": "Lie down and use your right hand to feel your left breast, and vice versa. Use a circular motion covering the entire breast."},
            {"step": 5, "title": "Standing Exam", "detail": "Feel your breasts while standing or sitting. Many women find this easiest in the shower."}
        ],
        "steps_ar": [
            {"step": 1, "title": "الفحص البصري", "detail": "قفي أمام المرآة مع وضع كتفيكِ مستقيمتين ويديكِ على الخصر. ابحثي عن أي تغييرات في الحجم أو الشكل أو اللون."},
            {"step": 2, "title": "رفع الذراعين", "detail": "ارفعي ذراعيكِ وابحثي عن نفس التغييرات."},
            {"step": 3, "title": "التحقق من الإفرازات", "detail": "ابحثي عن علامات تسرب السائل من إحدى الحلمتين أو كلتيهما."},
            {"step": 4, "title": "الفحص أثناء الاستلقاء", "detail": "استلقي ثم استخدمي يدكِ اليمنى لفحص ثديكِ الأيسر والعكس. استخدمي حركة دائرية تُغطي الثدي بالكامل."},
            {"step": 5, "title": "الفحص أثناء الوقوف", "detail": "افحصي ثدييكِ وأنتِ واقفة أو جالسة. تجد كثيرات أن هذا أسهل أثناء الاستحمام."}
        ]
    })
