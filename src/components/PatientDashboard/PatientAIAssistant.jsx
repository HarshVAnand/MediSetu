import React, { useState } from 'react';
import { Sparkles, Send, Volume2, Globe, ShieldCheck, CheckCircle2, User, Bot, AlertCircle } from 'lucide-react';
import { queryPatientAI } from '../../services/ragService.js';

export const PatientAIAssistant = ({ patient, prescriptions = [], records = [] }) => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${patient?.name || 'Patient'}! I am your MediSetu AI Assistant. I have full context of your connected health record across ${patient?.primaryCareUnit || 'your local clinic'} and SNR District Hospital. You can ask me anything about your medicines, diet precautions, lab test results, or upcoming referral appointments in your preferred language.`,
      sources: ['MediSetu Longitudinal Connected Health Graph'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const samplePrompts = [
    'Can I take Paracetamol for fever with my BP medicine?',
    'When should I take my morning diabetes tablet?',
    'What does my HbA1c 7.6% lab result mean?',
    'When is my District Hospital Cardiology appointment?'
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await queryPatientAI(textToSend, patient, prescriptions, records, language);
      
      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: response.answer,
        sources: response.sources,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId, text) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  return (
    <div className="med-card" style={{ padding: '1.75rem', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER & LANGUAGE SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-teal">Smart Health Q&A</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Instant Answers in Your Language</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={20} color="var(--medical-teal)" />
            <span>Ask Health & Medicine Questions</span>
          </h3>
        </div>

        {/* REGIONAL LANGUAGE SELECTOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} color="var(--primary-navy)" />
          <select 
            className="form-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8125rem', width: 'auto' }}
          >
            <option value="en">English (India)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>

      {/* QUICK SUGGESTION CHIPS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {samplePrompts.map((prompt, pidx) => (
          <button
            key={pidx}
            onClick={() => handleSend(prompt)}
            style={{
              background: 'var(--bg-page)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--primary-navy)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--medical-teal)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
          >
            💭 {prompt}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGE STREAM */}
      <div style={{
        flex: 1,
        maxHeight: '340px',
        overflowY: 'auto',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {messages.map(msg => (
          <div 
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={18} />
              </div>
            )}

            <div style={{
              background: msg.sender === 'user' ? 'var(--primary-navy)' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.15rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>

              {msg.sources && (
                <div style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.4rem',
                  borderTop: '1px dashed var(--border-light)',
                  fontSize: '0.7rem',
                  color: 'var(--medical-teal-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShieldCheck size={12} />
                  <span>Grounding: {msg.sources.join(' • ')}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.35rem',
                fontSize: '0.6875rem',
                color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-subtle)'
              }}>
                <span>{msg.timestamp}</span>

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: speakingMsgId === msg.id ? 'var(--medical-teal)' : 'var(--text-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.7rem'
                    }}
                    title="Read aloud in regional dialect"
                  >
                    <Volume2 size={13} />
                    <span>{speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}</span>
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--bg-muted)',
                color: 'var(--primary-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-subtle)', fontSize: '0.8125rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--medical-teal-subtle)',
              color: 'var(--medical-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} />
            </div>
            <span>Analyzing your longitudinal medical graph...</span>
          </div>
        )}
      </div>

      {/* INPUT FORM */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          display: 'flex',
          gap: '0.75rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-light)'
        }}
      >
        <input 
          type="text"
          className="form-input"
          placeholder="Ask about your medicines, sugar tests, or referral date..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button 
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="btn btn-teal"
        >
          <Send size={16} />
          <span>Ask</span>
        </button>
      </form>

    </div>
  );
};
