import React, { useState } from 'react';
import { Sparkles, Send, Volume2, Globe, ShieldCheck, CheckCircle2, User, Bot, AlertCircle } from 'lucide-react';
import { queryPatientAI } from '../../services/ragService.js';

export const PatientAIAssistant = ({ patient, prescriptions = [], records = [] }) => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${patient?.name || 'there'}! I am your MediSetu Health Assistant. I have all your records from ${patient?.primaryCareUnit || 'your local clinic'} and SNR District Hospital. You can ask me anything about your daily medicines, diet precautions, blood test results, or upcoming hospital appointments in your preferred language.`,
      sources: ['Your Saved Family Health Records'],
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
    'What does my HbA1c 7.6% blood sugar result mean?',
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
            <span className="badge badge-teal">Smart Health Helper</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Answers in Simple Everyday Language</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={20} color="var(--medical-teal)" />
            <span>MediSetu Health Assistant</span>
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

      {/* CHAT MESSAGES AREA */}
      <div style={{
        flex: 1,
        background: 'var(--bg-page)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        overflowY: 'auto',
        maxHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1rem'
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
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} />
              </div>
            )}

            <div style={{
              background: msg.sender === 'user' ? 'var(--primary-navy)' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
              padding: '0.85rem 1.15rem',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <div>{msg.text}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.4rem',
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.71875rem',
                  color: 'var(--medical-teal-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShieldCheck size={12} />
                  <span>Verified with: {msg.sources.join(', ')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.6875rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-subtle)' }}>
                  {msg.timestamp}
                </span>

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
                    title="Read aloud"
                  >
                    <Volume2 size={13} />
                    <span>{speakingMsgId === msg.id ? 'Playing...' : 'Listen'}</span>
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-navy)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--medical-teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} />
            </div>
            <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Checking your health record...
            </div>
          </div>
        )}
      </div>

      {/* INPUT FORM */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text"
          className="form-input"
          placeholder="Ask a question about your medicine, sugar, BP, or hospital visit..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isLoading}
        />

        <button 
          type="submit" 
          disabled={!inputQuery.trim() || isLoading}
          className="btn btn-teal"
        >
          <Send size={16} />
          <span>Ask</span>
        </button>
      </form>

    </div>
  );
};
