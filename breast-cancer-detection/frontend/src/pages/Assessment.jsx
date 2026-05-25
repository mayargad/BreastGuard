import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import Results from '../components/Results';
import './Assessment.css';

const SECTIONS = [
  { id: 'demographics', icon: '👤' },
  { id: 'family_history', icon: '👨‍👩‍👧' },
  { id: 'personal_history', icon: '🏥' },
  { id: 'reproductive', icon: '🌸' },
  { id: 'lifestyle', icon: '🏃' },
  { id: 'symptoms', icon: '🔍' },
];

const QUESTIONS = [
  { id: 'age', type: 'number', section: 'demographics',
    label_en: 'What is your age?', label_ar: 'كم عمركِ؟',
    min: 18, max: 100 },

  { id: 'family_first_degree', type: 'boolean', section: 'family_history',
    label_en: 'Mother, sister, or daughter with breast cancer?',
    label_ar: 'هل أُصيبت أمكِ أو أختكِ أو ابنتكِ بسرطان الثدي؟' },

  { id: 'family_second_degree', type: 'boolean', section: 'family_history',
    label_en: 'Grandmother, aunt, or cousin with breast cancer?',
    label_ar: 'هل أُصيبت جدتكِ أو خالتكِ أو ابنة عمتكِ بسرطان الثدي؟' },

  { id: 'family_bilateral', type: 'boolean', section: 'family_history',
    label_en: 'Any family member had cancer in both breasts?',
    label_ar: 'هل أُصيبت أيٌّ من أفراد عائلتكِ بسرطان في كلا الثديين؟' },

  { id: 'previous_breast_issue', type: 'boolean', section: 'personal_history',
    label_en: 'Previously had any breast problem or condition?',
    label_ar: 'هل عانيتِ سابقًا من أي مشكلة في الثدي؟' },

  { id: 'atypical_hyperplasia', type: 'boolean', section: 'personal_history',
    label_en: 'Diagnosed with atypical hyperplasia (abnormal breast cells)?',
    label_ar: 'هل تم تشخيصكِ بفرط التنسج اللانمطي (خلايا غير طبيعية في الثدي)؟' },

  { id: 'prior_biopsy', type: 'boolean', section: 'personal_history',
    label_en: 'Ever had a breast biopsy?',
    label_ar: 'هل أجريتِ خزعة للثدي من قبل؟' },

  { id: 'menarche_early', type: 'boolean', section: 'reproductive',
    label_en: 'Did your period start before age 12?',
    label_ar: 'هل بدأت دورتكِ الشهرية قبل سن 12؟' },

  { id: 'menopause_late', type: 'boolean', section: 'reproductive',
    label_en: 'Did you enter menopause after age 55?',
    label_ar: 'هل دخلتِ سن اليأس بعد سن 55؟' },

  { id: 'nulliparous', type: 'boolean', section: 'reproductive',
    label_en: 'Have you never been pregnant?',
    label_ar: 'هل لم تحملي أبدًا؟' },

  { id: 'first_birth_late', type: 'boolean', section: 'reproductive',
    label_en: 'First pregnancy after age 30?',
    label_ar: 'هل كان أول حمل لكِ بعد سن 30؟' },

  { id: 'hrt_use', type: 'boolean', section: 'reproductive',
    label_en: 'Currently using or have used hormone replacement therapy (HRT)?',
    label_ar: 'هل تستخدمين أو استخدمتِ العلاج بالهرمونات البديلة؟' },

  { id: 'alcohol_use', type: 'boolean', section: 'lifestyle',
    label_en: 'Do you regularly consume alcohol?',
    label_ar: 'هل تتناولين الكحول بانتظام؟' },

  { id: 'overweight_postmeno', type: 'boolean', section: 'lifestyle',
    label_en: 'Are you overweight or obese (especially post-menopause)?',
    label_ar: 'هل تعانين من زيادة الوزن أو السمنة (خاصةً بعد انقطاع الطمث)؟' },

  { id: 'physical_inactivity', type: 'boolean', section: 'lifestyle',
    label_en: 'Less than 150 minutes of exercise per week?',
    label_ar: 'هل تمارسين أقل من 150 دقيقة تمرين في الأسبوع؟' },

  { id: 'smoking', type: 'boolean', section: 'lifestyle',
    label_en: 'Do you smoke or have you smoked?',
    label_ar: 'هل تدخنين أو كنتِ تدخنين؟' },

  { id: 'lump', type: 'boolean', section: 'symptoms',
    label_en: 'Noticed a lump or thickening in breast or underarm?',
    label_ar: 'هل لاحظتِ كتلة أو سُمكًا غير طبيعي في الثدي أو الإبط؟' },

  { id: 'nipple_discharge', type: 'boolean', section: 'symptoms',
    label_en: 'Any nipple discharge (other than breast milk)?',
    label_ar: 'هل تعانين من إفرازات من الحلمة (غير حليب الثدي)؟' },

  { id: 'skin_changes', type: 'boolean', section: 'symptoms',
    label_en: 'Skin changes on breast (redness, dimpling, puckering)?',
    label_ar: 'هل لاحظتِ تغيرات في جلد الثدي (احمرار، تجعد، تقعر)؟' },

  { id: 'nipple_inversion', type: 'boolean', section: 'symptoms',
    label_en: 'Nipple recently turned inward?',
    label_ar: 'هل انقلبت حلمتكِ للداخل مؤخرًا؟' },

  { id: 'breast_pain_persistent', type: 'boolean', section: 'symptoms',
    label_en: 'Persistent, unexplained pain in breast or armpit?',
    label_ar: 'هل تعانين من ألم مستمر وغير مفسر في الثدي أو الإبط؟' },

  { id: 'armpit_lump', type: 'boolean', section: 'symptoms',
    label_en: 'Lump or swelling in armpit?',
    label_ar: 'هل لاحظتِ كتلة أو تورمًا في الإبط؟' },

  { id: 'size_change', type: 'boolean', section: 'symptoms',
    label_en: 'Change in size or shape of breast?',
    label_ar: 'هل لاحظتِ تغيرًا في حجم أو شكل ثديكِ؟' },
];

const SECTION_LABELS = {
  demographics:      { en: 'Personal Info', ar: 'المعلومات الشخصية' },
  family_history:    { en: 'Family History', ar: 'التاريخ العائلي' },
  personal_history:  { en: 'Medical History', ar: 'التاريخ الطبي' },
  reproductive:      { en: 'Reproductive History', ar: 'التاريخ الإنجابي' },
  lifestyle:         { en: 'Lifestyle', ar: 'نمط الحياة' },
  symptoms:          { en: 'Symptoms', ar: 'الأعراض' },
};

export default function Assessment() {
  const { lang, t } = useApp();
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sectionId = SECTIONS[currentSection].id;
  const sectionQuestions = QUESTIONS.filter(q => q.section === sectionId);
  const totalSections = SECTIONS.length;

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const sectionComplete = () => {
    return sectionQuestions.every(q => {
      if (q.type === 'number') return answers[q.id] !== undefined && answers[q.id] !== '';
      return answers[q.id] !== undefined;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...answers, age: parseInt(answers.age) };
      const res = await axios.post('/api/assessment/evaluate', payload);
      setResult(res.data);
    } catch (e) {
      setError(t('Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentSection(0);
    setResult(null);
    setError('');
  };

  if (result) return <Results result={result} onRestart={handleRestart} />;

  return (
    <div className="assessment-page">
      <div className="container">
        <div className="assessment-header">
          <span className="section-tag">{t('Free & Confidential', 'مجاني وسري')}</span>
          <h1>{t('Breast Cancer Risk Assessment', 'تقييم مخاطر سرطان الثدي')}</h1>
          <p>{t('Answer honestly for the most accurate results.', 'أجيبي بصدق للحصول على أكثر النتائج دقةً.')}</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className={`step ${i < currentSection ? 'done' : ''} ${i === currentSection ? 'active' : ''}`}
              onClick={() => i < currentSection && setCurrentSection(i)}
            >
              <div className="step-icon">
                {i < currentSection ? '✓' : s.icon}
              </div>
              <span className="step-label">
                {lang === 'ar' ? SECTION_LABELS[s.id].ar : SECTION_LABELS[s.id].en}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentSection) / totalSections) * 100}%` }}
          />
        </div>

        {/* Questions Card */}
        <div className="question-card card">
          <div className="question-section-header">
            <span className="q-section-icon">{SECTIONS[currentSection].icon}</span>
            <h2>
              {lang === 'ar'
                ? SECTION_LABELS[sectionId].ar
                : SECTION_LABELS[sectionId].en}
            </h2>
          </div>

          <div className="questions-list">
            {sectionQuestions.map((q, idx) => (
              <div className="question-item" key={q.id}>
                <div className="question-text">
                  <span className="q-num">{idx + 1}</span>
                  {lang === 'ar' ? q.label_ar : q.label_en}
                </div>

                {q.type === 'number' ? (
                  <div className="age-input-wrap">
                    <input
                      type="number"
                      min={q.min}
                      max={q.max}
                      value={answers[q.id] || ''}
                      onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder={t('Enter your age', 'أدخلي عمركِ')}
                      className="age-input"
                    />
                    <span className="age-unit">{t('years', 'سنة')}</span>
                  </div>
                ) : (
                  <div className="bool-buttons">
                    <button
                      className={`bool-btn yes ${answers[q.id] === true ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, true)}
                    >
                      {t('Yes', 'نعم')}
                    </button>
                    <button
                      className={`bool-btn no ${answers[q.id] === false ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, false)}
                    >
                      {t('No', 'لا')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}

          {/* Navigation */}
          <div className="question-nav">
            {currentSection > 0 && (
              <button
                className="btn-secondary"
                onClick={() => setCurrentSection(p => p - 1)}
              >
                {t('← Back', 'رجوع →')}
              </button>
            )}

            {currentSection < totalSections - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentSection(p => p + 1)}
                disabled={!sectionComplete()}
              >
                {t('Next →', 'التالي ←')}
              </button>
            ) : (
              <button
                className="btn-primary submit-btn"
                onClick={handleSubmit}
                disabled={!sectionComplete() || loading}
              >
                {loading
                  ? t('Calculating...', 'جارٍ الحساب...')
                  : t('Get My Results 🎀', 'احصلي على نتائجي 🎀')}
              </button>
            )}
          </div>
        </div>

        <p className="assessment-disclaimer">
          ⚕️ {t(
            'This assessment is for educational awareness only and is not a medical diagnosis.',
            'هذا التقييم لأغراض التوعية التعليمية فقط وليس تشخيصًا طبيًا.'
          )}
        </p>
      </div>
    </div>
  );
}
