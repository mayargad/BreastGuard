import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './SelfExam.css';

const STEPS = [
  {
    num: 1, icon: '🪞',
    title_en: 'Visual Inspection — Hands on Hips',
    title_ar: 'الفحص البصري — اليدان على الخصر',
    desc_en: 'Stand in front of a mirror with your shoulders straight and your hands on your hips. Look for any changes in the size, shape, or color of your breasts. Look for any dimpling, puckering, or bulging of the skin.',
    desc_ar: 'قفي أمام المرآة مع وضع كتفيكِ مستقيمتين ويديكِ على الخصر. ابحثي عن أي تغييرات في حجم أو شكل أو لون ثدييكِ. ابحثي عن أي تجعد أو انكماش أو انتفاخ في الجلد.',
    tip_en: 'Look for: redness, soreness, rash, or swelling.',
    tip_ar: 'انتبهي لـ: الاحمرار، الألم، الطفح الجلدي، أو التورم.',
  },
  {
    num: 2, icon: '🙌',
    title_en: 'Visual Inspection — Arms Raised',
    title_ar: 'الفحص البصري — الذراعان مرفوعتان',
    desc_en: 'Now, raise your arms and look for the same changes. Also look for signs of fluid coming out of one or both nipples — this could be a watery, milky, or yellow fluid, or blood.',
    desc_ar: 'الآن ارفعي ذراعيكِ وابحثي عن نفس التغييرات. كذلك ابحثي عن علامات تسرب سائل من إحدى الحلمتين أو كلتيهما — قد يكون سائلًا مائيًا أو حليبيًا أو أصفر اللون، أو دمًا.',
    tip_en: 'Any nipple discharge (outside breastfeeding) warrants a doctor visit.',
    tip_ar: 'أي إفراز من الحلمة (خارج فترة الرضاعة) يستوجب زيارة الطبيب.',
  },
  {
    num: 3, icon: '🛋️',
    title_en: 'Lying Down Exam',
    title_ar: 'الفحص في وضعية الاستلقاء',
    desc_en: 'Lie down and place your right arm behind your head. Use the finger pads of your left hand to feel your right breast using a firm, smooth circular motion. Cover the entire breast from top to bottom, side to side — from your collarbone to the top of your abdomen, and from your armpit to your cleavage.',
    desc_ar: 'استلقي وضعي ذراعكِ اليمنى خلف رأسك. استخدمي أطراف أصابع يدكِ اليسرى لفحص ثديكِ الأيمن بحركة دائرية ثابتة وسلسة. غطي الثدي بالكامل من الأعلى إلى الأسفل ومن جانب إلى آخر.',
    tip_en: 'Use light, medium, and firm pressure to feel different layers of tissue.',
    tip_ar: 'استخدمي ضغطًا خفيفًا ومتوسطًا وقويًا للشعور بطبقات الأنسجة المختلفة.',
  },
  {
    num: 4, icon: '🚿',
    title_en: 'Standing or Sitting Exam',
    title_ar: 'الفحص في وضعية الوقوف أو الجلوس',
    desc_en: 'Feel your breasts while standing or sitting. Many women find this easiest in the shower. Cover your entire breast using the same hand movements described in step 3.',
    desc_ar: 'افحصي ثدييكِ وأنتِ واقفة أو جالسة. تجد كثيرات أن هذا أسهل أثناء الاستحمام. غطي ثدييكِ بالكامل باستخدام نفس حركات اليد الموضحة في الخطوة 3.',
    tip_en: 'The shower is an ideal time — wet skin makes lumps easier to feel.',
    tip_ar: 'وقت الاستحمام مثالي — الجلد المبلل يجعل الكتل أسهل في الإحساس بها.',
  },
  {
    num: 5, icon: '📅',
    title_en: 'When & How Often',
    title_ar: 'متى وكم مرة',
    desc_en: 'Perform a breast self-exam once a month. The best time is a few days after your period ends, when your breasts are less likely to be swollen or tender. If you no longer have periods, choose the same day every month.',
    desc_ar: 'أجري الفحص الذاتي للثدي مرة واحدة شهريًا. أفضل وقت هو بعد انتهاء دورتكِ الشهرية بأيام قليلة، عندما يقل احتمال تورم الثدي أو ألمه. إذا لم تكن لديكِ دورة شهرية بعد الآن، فاختاري نفس اليوم كل شهر.',
    tip_en: 'Set a monthly reminder on your phone so you never miss it!',
    tip_ar: 'ضعي تذكيرًا شهريًا على هاتفك حتى لا تفوتيه أبدًا!',
  },
];

export default function SelfExam() {
  const { lang, t } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="selfexam-page">
      <div className="selfexam-hero">
        <div className="container">
          <span className="section-tag">{t('Monthly Routine', 'الروتين الشهري')}</span>
          <h1>{t('Breast Self-Examination Guide', 'دليل الفحص الذاتي للثدي')}</h1>
          <p>{t(
            'Regular self-exams help you know your normal — so you can quickly notice any changes. Takes just 5 minutes.',
            'تساعدكِ الفحوصات الذاتية المنتظمة على معرفة ما هو طبيعي لكِ — حتى تتمكني من ملاحظة أي تغييرات بسرعة. تستغرق 5 دقائق فقط.'
          )}</p>
        </div>
      </div>

      <div className="container selfexam-content">
        <div className="steps-layout">
          {/* Step Tabs */}
          <div className="step-tabs">
            {STEPS.map((s, i) => (
              <button
                key={i}
                className={`step-tab ${activeStep === i ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="step-tab-icon">{i < activeStep ? '✓' : s.icon}</div>
                <div className="step-tab-info">
                  <span className="step-tab-num">{t(`Step ${s.num}`, `الخطوة ${s.num}`)}</span>
                  <span className="step-tab-title">{t(s.title_en, s.title_ar)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step */}
          <div className="step-detail card animate-in" key={activeStep}>
            <div className="step-detail-header">
              <div className="step-big-icon">{STEPS[activeStep].icon}</div>
              <div>
                <div className="step-num-label">{t(`Step ${STEPS[activeStep].num} of 5`, `الخطوة ${STEPS[activeStep].num} من 5`)}</div>
                <h2>{t(STEPS[activeStep].title_en, STEPS[activeStep].title_ar)}</h2>
              </div>
            </div>
            <div className="ribbon-bar" />
            <p className="step-desc">{t(STEPS[activeStep].desc_en, STEPS[activeStep].desc_ar)}</p>
            <div className="step-tip">
              <span className="tip-icon">💡</span>
              <p>{t(STEPS[activeStep].tip_en, STEPS[activeStep].tip_ar)}</p>
            </div>
            <div className="step-nav">
              <button
                className="btn-secondary"
                onClick={() => setActiveStep(p => p - 1)}
                disabled={activeStep === 0}
              >
                {t('← Previous', 'السابق ←')}
              </button>
              {activeStep < STEPS.length - 1 ? (
                <button className="btn-primary" onClick={() => setActiveStep(p => p + 1)}>
                  {t('Next Step →', 'الخطوة التالية ←')}
                </button>
              ) : (
                <button className="btn-primary done-btn" onClick={() => setActiveStep(0)}>
                  {t('🎀 Start Over', '🎀 ابدئي من جديد')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Warning Signs Reminder */}
        <div className="warning-reminder card">
          <h3>⚠️ {t('See a Doctor Immediately If You Notice:', 'راجعي الطبيب فورًا إذا لاحظتِ:')}</h3>
          <div className="warning-grid">
            {[
              { en: 'A new lump or hard knot', ar: 'كتلة جديدة أو عقدة صلبة' },
              { en: 'Nipple discharge or bleeding', ar: 'إفرازات أو نزيف من الحلمة' },
              { en: 'Skin dimpling or puckering', ar: 'تجعد أو انكماش في الجلد' },
              { en: 'Nipple inversion (turning inward)', ar: 'انقلاب الحلمة للداخل' },
              { en: 'Persistent breast pain', ar: 'ألم مستمر في الثدي' },
              { en: 'Swelling in the armpit', ar: 'تورم في الإبط' },
            ].map((w, i) => (
              <div key={i} className="warning-item">
                <span className="warning-dot" />
                {t(w.en, w.ar)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
