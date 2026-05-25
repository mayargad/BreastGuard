import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './About.css';

const SYMPTOMS = [
  { icon: '🔵', en: 'A new lump or thickening in the breast or armpit', ar: 'كتلة جديدة أو سُمك غير طبيعي في الثدي أو الإبط' },
  { icon: '🔵', en: 'Change in size, shape, or appearance of a breast', ar: 'تغير في حجم الثدي أو شكله أو مظهره' },
  { icon: '🔵', en: 'Skin changes: dimpling, redness, pitting (like orange peel)', ar: 'تغيرات جلدية: تجعد، احمرار، نقر (كقشر البرتقال)' },
  { icon: '🔵', en: 'Nipple that has recently turned inward (inverted)', ar: 'حلمة انقلبت للداخل مؤخرًا' },
  { icon: '🔵', en: 'Nipple discharge other than breast milk', ar: 'إفرازات من الحلمة غير حليب الثدي' },
  { icon: '🔵', en: 'Persistent, unexplained pain in breast or armpit', ar: 'ألم مستمر وغير مفسر في الثدي أو الإبط' },
];

const RISK_FACTORS = [
  { cat_en: 'Cannot be changed', cat_ar: 'لا يمكن تغييرها', color: '#e63946', items: [
    { en: 'Being female', ar: 'كونك أنثى' },
    { en: 'Increasing age (risk rises after 50)', ar: 'التقدم في العمر (الخطر يرتفع بعد 50)' },
    { en: 'Family history of breast cancer', ar: 'تاريخ عائلي بسرطان الثدي' },
    { en: 'Inherited gene mutations (BRCA1, BRCA2)', ar: 'طفرات جينية وراثية (BRCA1, BRCA2)' },
    { en: 'Dense breast tissue', ar: 'كثافة الأنسجة الثديية' },
  ]},
  { cat_en: 'Can be changed', cat_ar: 'يمكن تغييرها', color: '#2a9d8f', items: [
    { en: 'Alcohol consumption', ar: 'استهلاك الكحول' },
    { en: 'Being overweight or obese (post-menopause)', ar: 'زيادة الوزن أو السمنة بعد انقطاع الطمث' },
    { en: 'Physical inactivity', ar: 'الخمول البدني' },
    { en: 'Hormone replacement therapy (HRT)', ar: 'العلاج بالهرمونات البديلة' },
    { en: 'Smoking', ar: 'التدخين' },
  ]},
];

const SCREENING = [
  { icon: '🖐️', en: 'Breast Self-Exam', ar: 'الفحص الذاتي للثدي', freq_en: 'Monthly', freq_ar: 'شهريًا', desc_en: 'Learn how to examine your own breasts and know your normal.', desc_ar: 'تعلمي كيفية فحص ثدييكِ بنفسك وتعرفي على الطبيعي لكِ.' },
  { icon: '👩‍⚕️', en: 'Clinical Breast Exam', ar: 'الفحص السريري للثدي', freq_en: 'Every 1–3 years', freq_ar: 'كل 1-3 سنوات', desc_en: 'A doctor or nurse examines your breasts for lumps or other changes.', desc_ar: 'يفحص الطبيب أو الممرض ثدييكِ بحثًا عن كتل أو تغييرات.' },
  { icon: '🩻', en: 'Mammography', ar: 'التصوير الشعاعي للثدي (ماموجرام)', freq_en: 'Annually from age 40+', freq_ar: 'سنويًا من سن 40 فما فوق', desc_en: 'X-ray of the breast that can detect tumors before they can be felt.', desc_ar: 'أشعة سينية للثدي تكشف الأورام قبل الشعور بها.' },
  { icon: '🧬', en: 'Blood Tumor Markers', ar: 'علامات الورم في الدم', freq_en: 'As recommended by doctor', freq_ar: 'حسب توصية الطبيب', desc_en: 'CA 15-3, CEA, and CBC tests can provide useful diagnostic indicators.', desc_ar: 'اختبارات CA 15-3 وCEA وصورة الدم الكاملة توفر مؤشرات تشخيصية مفيدة.' },
];

export default function About() {
  const { lang, t } = useApp();
  const [activeTab, setActiveTab] = useState('symptoms');

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <span className="section-tag">{t('Education & Awareness', 'التعليم والتوعية')}</span>
          <h1>{t('Understanding Breast Cancer', 'فهم سرطان الثدي')}</h1>
          <p>{t('Knowledge is your first line of defense. Learn the facts, signs, and how to protect yourself.', 'المعرفة هي خط دفاعكِ الأول. تعرفي على الحقائق والعلامات وكيفية حماية نفسك.')}</p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="about-stats-strip">
        <div className="container">
          <div className="about-stats">
            {[
              { num: '#1', label_en: 'Most common cancer in women', label_ar: 'أكثر أنواع السرطان شيوعًا عند النساء' },
              { num: '99%', label_en: 'Survival rate if caught in Stage 1', label_ar: 'نسبة النجاة عند اكتشافه في المرحلة الأولى' },
              { num: '2.3M', label_en: 'New cases diagnosed yearly', label_ar: 'حالة جديدة تُشخَّص سنويًا' },
              { num: '40+', label_en: 'Age to start annual screening', label_ar: 'العمر للبدء بالفحص السنوي' },
            ].map((s, i) => (
              <div key={i} className="about-stat">
                <div className="about-stat-num">{s.num}</div>
                <div className="about-stat-label">{t(s.label_en, s.label_ar)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container about-content">
        <div className="tab-nav">
          {[
            { id: 'symptoms', en: '🔍 Symptoms', ar: '🔍 الأعراض' },
            { id: 'risk', en: '⚠️ Risk Factors', ar: '⚠️ عوامل الخطر' },
            { id: 'screening', en: '🩺 Screening', ar: '🩺 الكشف المبكر' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.en, tab.ar)}
            </button>
          ))}
        </div>

        {/* Symptoms Tab */}
        {activeTab === 'symptoms' && (
          <div className="tab-content animate-in">
            <div className="tab-intro card">
              <h2>{t('Warning Signs to Watch For', 'العلامات التحذيرية التي يجب الانتباه إليها')}</h2>
              <p>{t(
                'If you notice any of the following changes in your breast, see your doctor promptly. These symptoms do not necessarily mean cancer, but they should always be checked.',
                'إذا لاحظتِ أيًا من التغييرات التالية في ثديكِ، فراجعي طبيبك على الفور. هذه الأعراض لا تعني بالضرورة الإصابة بالسرطان، لكن يجب فحصها دائمًا.'
              )}</p>
            </div>
            <div className="symptoms-list">
              {SYMPTOMS.map((s, i) => (
                <div key={i} className="symptom-item card">
                  <span className="symptom-icon">{s.icon}</span>
                  <p>{t(s.en, s.ar)}</p>
                </div>
              ))}
            </div>
            <div className="cta-row">
              <Link to="/assessment" className="btn-primary">{t('Check Your Risk Now →', 'تحققي من مخاطرك الآن ←')}</Link>
            </div>
          </div>
        )}

        {/* Risk Factors Tab */}
        {activeTab === 'risk' && (
          <div className="tab-content animate-in">
            <div className="risk-factors-wrap">
              {RISK_FACTORS.map((group, gi) => (
                <div key={gi} className="risk-group card">
                  <div className="risk-group-header" style={{ borderColor: group.color }}>
                    <div className="risk-group-dot" style={{ background: group.color }} />
                    <h3>{t(group.cat_en, group.cat_ar)}</h3>
                  </div>
                  <ul className="risk-items">
                    {group.items.map((item, ii) => (
                      <li key={ii}>
                        <span style={{ color: group.color }}>→</span> {t(item.en, item.ar)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="risk-note card">
              <p>💡 {t(
                'Having risk factors does not mean you will develop breast cancer. Many women with risk factors never develop the disease, while many without known risk factors do. Regular screening remains the most powerful tool.',
                'امتلاك عوامل الخطر لا يعني بالضرورة الإصابة بسرطان الثدي. كثير من النساء اللواتي لديهن عوامل خطر لا يصبن بالمرض، في حين تُصاب أخريات لا تنطبق عليهن عوامل الخطر المعروفة. يبقى الفحص المنتظم أقوى أداة.'
              )}</p>
            </div>
          </div>
        )}

        {/* Screening Tab */}
        {activeTab === 'screening' && (
          <div className="tab-content animate-in">
            <div className="screening-grid">
              {SCREENING.map((s, i) => (
                <div key={i} className="screening-card card">
                  <div className="screening-icon">{s.icon}</div>
                  <h3>{t(s.en, s.ar)}</h3>
                  <div className="screening-freq">{t('Frequency: ', 'التكرار: ')}<strong>{t(s.freq_en, s.freq_ar)}</strong></div>
                  <p>{t(s.desc_en, s.desc_ar)}</p>
                </div>
              ))}
            </div>
            <div className="screening-cta card">
              <h3>{t('Ready to get started?', 'هل أنتِ مستعدة للبدء؟')}</h3>
              <p>{t('Use our assessment tool which includes blood marker guidance and symptom analysis.', 'استخدمي أداة التقييم لدينا التي تتضمن إرشادات علامات الدم وتحليل الأعراض.')}</p>
              <Link to="/assessment" className="btn-primary">{t('Start Assessment →', 'ابدأي التقييم ←')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
