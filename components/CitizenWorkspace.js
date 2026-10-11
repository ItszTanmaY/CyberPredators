'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, BookOpen, AlertCircle, Volume2 } from 'lucide-react';

export default function CitizenWorkspace({ record, documentPages = [] }) {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'

  if (!record) return null;

  const {
    outcome,
    case_type,
    parties,
    summary,
    summary_hi,
  } = record;

  const glossary = [
    {
      term: 'Bail (जमानत)',
      meaningEn: 'Temporary release of an accused person from jail while the court case is still ongoing.',
      meaningHi: 'मुकदमा चलने के दौरान जेल से मिलने वाली अस्थायी कानूनी रिहाई।',
    },
    {
      term: 'Personal Bond (निजी मुचलका)',
      meaningEn: 'A written legal promise signed by the accused promising to pay a specified amount if they fail to attend court.',
      meaningHi: 'अदालत में पेश होने का कानूनी लिखित वचन पत्र, जिसे न मानने पर तय राशि चुकानी होगी।',
    },
    {
      term: 'Surety (जमानती)',
      meaningEn: 'A person (usually family or friend) who promises the court that the accused will follow all court orders.',
      meaningHi: 'वह व्यक्ति जो अदालत में यह जिम्मेदारी लेता है कि आरोपी हर तारीख पर पेश होगा।',
    },
    {
      term: 'Article 21 (अनुच्छेद 21)',
      meaningEn: 'The fundamental constitutional right protecting personal life and liberty, including the right to a speedy trial.',
      meaningHi: 'संविधान का मौलिक अधिकार जो जीवन, स्वतंत्रता और समय पर निष्पक्ष न्याय की गारंटी देता है।',
    },
    {
      term: 'Operative Order (अंतिम कार्यकारी आदेश)',
      meaningEn: 'The final binding directive issued by the judges at the very conclusion of the judgment.',
      meaningHi: 'फैसले के अंत में जजों द्वारा दिया गया मुख्य और बाध्यकारी आदेश।',
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-surface p-5 sm:p-6 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-verified uppercase tracking-wide bg-page px-2 py-0.5 rounded border border-border">
              Public Legal Literacy Desk
            </span>
            <span className="text-[12px] text-muted">
              नागरिक एवं वादकारी सहायता
            </span>
          </div>
          <h2 className="text-[18px] font-serif font-semibold text-text">
            {lang === 'en' ? 'Understand Your Case & Next Steps' : 'अपने फैसले को समझें और अगले कदम'}
          </h2>
        </div>

        {/* Language switch */}
        <div className="inline-flex rounded-control border border-border p-0.5 bg-page text-[12px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`min-h-[32px] px-3 rounded-[4px] font-medium transition-colors ${
              lang === 'en'
                ? 'bg-surface text-text border border-border'
                : 'text-muted hover:text-text'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`min-h-[32px] px-3 rounded-[4px] font-medium transition-colors ${
              lang === 'hi'
                ? 'bg-surface text-text border border-border font-hindi'
                : 'text-muted hover:text-text font-hindi'
            }`}
          >
            सरल हिन्दी
          </button>
        </div>
      </div>

      {/* 1. "What Does This Judgment Mean For You?" */}
      <div className="p-4 sm:p-5 rounded-control border border-verified/50 bg-page/70 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-verified flex-shrink-0" strokeWidth={1.5} />
          <h3 className="text-[15px] font-semibold text-text">
            {lang === 'en' ? 'What this decision means in plain words' : 'सरल शब्दों में इस फैसले का मतलब'}
          </h3>
        </div>

        {lang === 'en' ? (
          <div className="space-y-2 text-[14px] leading-relaxed text-text">
            <p>
              <strong>Status:</strong> The court has <strong>allowed</strong> the appeal and granted <strong>bail</strong>. The accused person does not have to stay in jail while waiting for the trial.
            </p>
            <p>
              <strong>Are the charges cancelled?</strong> No. The main criminal case and accusations are still going on in the trial court. This order only decides where the person stays while the case is heard.
            </p>
            <p>
              <strong>Why did the Court decide this?</strong> Because the trial has not started even after 17 months, and there are over 400 witnesses. The Supreme Court said nobody can be kept in jail indefinitely without trial.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-[14px] leading-relaxed text-text font-hindi">
            <p>
              <strong>फैसले का मुख्य असर:</strong> अदालत ने याचिका स्वीकार कर ली है और <strong>जमानत मंजूर</strong> कर दी है। अब आरोपी को मुकदमा चलने तक जेल में नहीं रहना होगा।
            </p>
            <p>
              <strong>क्या मुकदमा खत्म हो गया है?</strong> नहीं। मुख्य आपराधिक आरोप और मुकदमा निचली अदालत में जारी रहेगा। यह फैसला सिर्फ जेल से रिहाई के संबंध में है।
            </p>
            <p>
              <strong>अदालत ने ऐसा क्यों कहा?</strong> क्योंकि 17 महीने बीतने के बाद भी गवाही शुरू नहीं हो पाई थी और 400 से अधिक गवाह हैं। सुप्रीम कोर्ट ने कहा कि बिना मुकदमे के किसी को अनिश्चित काल तक जेल में रखना अधिकार का हनन है।
            </p>
          </div>
        )}
      </div>

      {/* 2. Litigant Action Checklist & Next Steps */}
      <div className="space-y-3">
        <h3 className="text-[14px] font-semibold text-text flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-action" strokeWidth={1.5} />
          <span>
            {lang === 'en' ? 'What you need to do next (Action Checklist)' : 'अगले आवश्यक कानूनी कदम (जाँच सूची)'}
          </span>
        </h3>

        <div className="space-y-2 text-[13px]">
          {[
            {
              en: '1. Collect certified copy: Obtain the stamped certified copy of this judgment from the Supreme Court copying agency.',
              hi: '1. प्रमाणित प्रति प्राप्त करें: सुप्रीम कोर्ट कॉपीइंग एजेंसी से इस फैसले की मुहरबंद प्रमाणित प्रति प्राप्त करें।',
            },
            {
              en: '2. Prepare personal bond: Prepare a personal bond of ₹10,00,000 as directed by the Court.',
              hi: '2. निजी मुचलका तैयार करें: अदालत के निर्देशानुसार ₹10,00,000 का निजी मुचलका तैयार करें।',
            },
            {
              en: '3. Arrange two sureties: Find two solvent guarantors with valid identity, address proof, and property or income papers.',
              hi: '3. दो जमानती पेश करें: वैध पहचान पत्र, निवास प्रमाण और आय/संपत्ति दस्तावेजों के साथ दो सक्षम जमानती तैयार करें।',
            },
            {
              en: '4. Present papers to trial court: Submit the bonds before the Special Judge for scrutiny and issuance of the release warrant.',
              hi: '4. निचली अदालत में कागजात जमा करें: विशेष अदालत में मुचलके पेश करें ताकि रिहाई का परवाना जारी हो सके।',
            },
            {
              en: '5. Surrender passport: Deposit passport with the investigating agency within the timeframe specified.',
              hi: '5. पासपोर्ट जमा करें: तय समय सीमा के भीतर पासपोर्ट जांच एजेंसी को सौंपें।',
            },
          ].map((step, idx) => (
            <div key={idx} className="p-3 rounded-control border border-border bg-page flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full border border-border bg-surface text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className={`text-text leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'en' ? step.en : step.hi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Legal Jargon Decoder */}
      <div className="space-y-3">
        <h3 className="text-[14px] font-semibold text-text flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-action" strokeWidth={1.5} />
          <span>
            {lang === 'en' ? 'Legal terms explained in simple language' : 'कानूनी शब्दों का आसान मतलब (शब्दावली)'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px]">
          {glossary.map((item, idx) => (
            <div key={idx} className="p-3 rounded-control border border-border bg-page space-y-1">
              <div className="font-semibold text-action text-[13px]">
                {item.term}
              </div>
              <p className={`text-muted text-[12px] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'en' ? item.meaningEn : item.meaningHi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
