import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Sparkles, TrendingUp, CheckCircle, AlertCircle, Share2 } from 'lucide-react';
import { trackEvent } from './analytics.js';

const MessageScore = () => {
  const [messageType, setMessageType] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [displayScore, setDisplayScore] = useState(0);
  const [hasEquity, setHasEquity] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const messageTypes = [
    'Website Headline', 'Value Proposition', 'Paid Ad Copy', 'Email Subject Line',
    'Social Post', 'Sales Deck Intro', 'Press Quote', 'Product Description',
    'Call-to-Action (CTA)', 'Cold Outreach Line', 'Tagline', 'Feature Highlight', 'Other'
  ];

  const getTierInfo = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300', strokeColor: '#10b981' };
    if (score >= 80) return { label: 'Strong', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300', strokeColor: '#3b82f6' };
    if (score >= 70) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-300', strokeColor: '#f59e0b' };
    if (score >= 60) return { label: 'Needs Work', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300', strokeColor: '#f97316' };
    return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300', strokeColor: '#dc2626' };
  };

  const getNextTier = (score) => {
    if (score >= 90) return null;
    if (score >= 80) return { name: 'Excellent', threshold: 90 };
    if (score >= 70) return { name: 'Strong', threshold: 80 };
    if (score >= 60) return { name: 'Good', threshold: 70 };
    return { name: 'Needs Work', threshold: 60 };
  };

  useEffect(() => {
    if (result?.total_score) {
      setDisplayScore(0);
      let current = 0;
      const timer = setInterval(() => {
        current += 2;
        if (current >= result.total_score) {
          setDisplayScore(result.total_score);
          clearInterval(timer);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [result]);

  // Track when message type is selected
  const handleMessageTypeChange = (type) => {
    setMessageType(type);
    if (type) {
      trackEvent('message_type_selected', {
        message_type: type
      });
    }
  };

  // Track when brand equity checkbox is toggled
  const handleEquityChange = (checked) => {
    setHasEquity(checked);
    trackEvent('brand_equity_toggled', {
      has_equity: checked,
      message_type: messageType
    });
  };

  // Track navigation clicks
  const handleNavClick = (destination) => {
    trackEvent('navigation_click', {
      destination: destination
    });
  };

  const evaluateMessage = async () => {
    setError('');
    setResult(null);
    setCopied(false);
    setEmailSent(false);

    if (!messageType) {
      setError('Select a message type.');
      return;
    }

    if (messageText.trim().length < 10) {
      setError('Too short. Write at least one sentence.');
      return;
    }

    setLoading(true);

    try {
      const prompt = `You are MessageScore. Score this ${messageType} with Copy Chief voice - sharp, witty, specific.

MESSAGE: "${messageText}"
BRAND CONTEXT: ${hasEquity ? 'Established brand with existing recognition and equity' : 'New or unknown brand without established recognition'}

SCORING (CVT Framework):
${(messageType === 'Tagline' || messageType === 'Website Headline') && hasEquity ? `
SPECIAL RULES FOR ESTABLISHED BRAND TAGLINES/HEADLINES:
- Clarity becomes "Memorability" (rhythm, punch, stickiness, emotional resonance)
- Verifiability becomes "Strategic Alignment" (does it match brand's known positioning?)
- Trust becomes "Distinctiveness" (unique vs. generic? ownable?)
- Abstract/aspirational messaging is VALID for established brands
- Focus on emotional impact and memorability over literal proof
- Examples: "Just Do It" (Nike), "Think Different" (Apple) would score 85-95

Standard scoring for new brands OR non-tagline message types:
` : ''}
- Clarity (40%): 1-10. Score 10 = short/sharp, 2 = jargon-heavy
- Verifiability (30%): 1-10. Score 10 = named source + metric, 2 = marketing speak
- Trust (30%): 1-10. Score 10 = grounded/proof, 2 = desperate/hype

TONE - Copy Chief with dry wit (constructive, never hostile):
- Excellent (90+): "Tight. Ship it."
- Strong (80-89): "Solid. One more pass."
- Good (70-79): "Close. Be more specific about 'better.'"
- Needs Work (60-69): "Too vague. Name a customer or add a number."
- Weak (<60): "Where's the proof? Add real data."

VOICE POSITIONING - Critical:
- Position as diagnostic helper, NOT as judge or authority
- Never use "me", "we", "us" in feedback
- Bad: "tells me nothing", "I need to see proof"
- Good: "says nothing", "needs specific proof"
- Be neutral and observational, not personal
- The feedback is about the message, not about pleasing MessageScore
- IMPORTANT: Count words carefully. "Just Do It" = 3 words, not 2. Don't reference incorrect word counts.

Blacklisted: "innovative", "cutting-edge", "game-changing", "revolutionary", "best-in-class"

Be direct but respectful. Sharp, not mean. No insults or aggressive language.

REWRITE GUIDELINES (if score < 70):
Apply these rules in order:
1. Lead with specific, measurable outcome (not vague benefit)
2. Add concrete proof: number, percentage, customer name, or source
3. Remove ALL vague words: "better", "streamline", "optimize", "help", "improve"
4. Remove ALL blacklisted marketing speak
5. Keep under 25 words
6. Use active voice, present tense
7. Make it sound human and conversational, not corporate

Framework to apply based on message type:
- For value props: Specific outcome + Proof point + Credibility anchor
  Example: "73% faster onboarding (median of 40 customers, measured in Salesforce)"
- For features: What it does (concrete) + Why that matters (measurable impact)
  Example: "Auto-tags 10,000 support tickets/hour, cuts response time from 4 hours to 12 minutes"
- For CTAs: Action + Specific benefit + Social proof
  Example: "Book a demo. See how Stripe cut API errors by 60% in 2 weeks"

JSON response only:
{"clarity_score": 1-10, "verifiability_score": 1-10, "trust_score": 1-10, "total_score": (C*0.4+V*0.3+T*0.3)*10 rounded, "clarity_feedback": "sharp sentence referencing actual message content", "verifiability_feedback": "sharp sentence referencing actual message content", "trust_feedback": "sharp sentence referencing actual message content", "improvements": ["specific action referencing message content", "specific action referencing message content"], "has_blacklisted_words": bool, "blacklist_note": "Delete X and Y" if true, "rewrite": "improved version following guidelines above" if <70, "equity_note": "brief note about how brand equity affects this score" if established brand}`;

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      const text = data.content[0].text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const parsedResult = JSON.parse(text);
      setResult(parsedResult);

      // Track the scoring event
      trackEvent('message_scored', {
        message_type: messageType,
        score: parsedResult.total_score,
        has_brand_equity: hasEquity,
        has_rewrite: !!parsedResult.rewrite
      });

      // Track if rewrite was provided
      if (parsedResult.rewrite) {
        trackEvent('rewrite_provided', {
          original_score: parsedResult.total_score,
          message_type: messageType
        });
      }
    } catch (err) {
      setError('Evaluation failed. Try again.');
      trackEvent('scoring_error', {
        message_type: messageType
      });
    } finally {
      setLoading(false);
    }
  };

  const copyScoreToClipboard = () => {
    if (!result) return;
    
    const scoreText = `Original Message: "${messageText}"

MessageScore: ${result.total_score}/100 (${tier.label})
Clarity: ${result.clarity_score}/10 | Verifiability: ${result.verifiability_score}/10 | Trust: ${result.trust_score}/10

Test your messaging at MessageScore.com`;

    navigator.clipboard.writeText(scoreText).then(() => {
      setCopied(true);
      
      // Track copy event
      trackEvent('score_copied', {
        score: result.total_score,
        message_type: messageType
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEmailReport = async () => {
    if (!email || !result) return;
    
    setEmailError('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          messageText,
          messageType,
          result
        })
      });

      if (response.ok) {
        setEmailSent(true);
        
        // Track email report request
        trackEvent('email_report_sent', {
          score: result.total_score,
          message_type: messageType
        });
        
        setTimeout(() => {
          setEmailSent(false);
          setEmail('');
        }, 3000);
      } else {
        setEmailError('Failed to send email. Please try again.');
      }
    } catch (err) {
      setEmailError('Failed to send email. Please try again.');
    }
  };

  const tier = result ? getTierInfo(result.total_score) : null;
  const nextTier = result ? getNextTier(result.total_score) : null;

  return (
    <div className="min-h-screen bg-stone-50 p-4 sm:p-6">
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/messagescore-logo.png" alt="MessageScore" className="w-12 h-12 rounded-lg" />
            <h1 className="text-4xl font-bold text-slate-900">MessageScore</h1>
          </div>
          
          {/* Navigation Links */}
          <div className="flex justify-center gap-6 mb-4">
            <Link 
              to="/about" 
              onClick={() => handleNavClick('about')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              About
            </Link>
            <Link 
              to="/how-it-works" 
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              How It Works
            </Link>
          </div>

          <p className="text-slate-700 text-sm font-medium max-w-2xl mx-auto">
            Stop guessing if your words work. Score and improve them instantly with the first diagnostic tool built for marketing messaging. Clarity, trust and proof are now KPIs. Not opinions.
          </p>
        </div>

        <div className="bg-white border-2 border-stone-200 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Message Type</label>
            <select
              value={messageType}
              onChange={(e) => handleMessageTypeChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type...</option>
              {messageTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Your Message (1-3 sentences)</label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(messageType === 'Tagline' || messageType === 'Website Headline') && (
            <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEquity}
                  onChange={(e) => handleEquityChange(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-900">This is for an established brand with recognition</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Abstract messaging works for known brands (Nike, Apple). New brands need more grounding and specificity.
                  </p>
                </div>
              </label>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={evaluateMessage}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:bg-stone-300 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Scoring...</> : <><TrendingUp className="w-5 h-5" /> Get Your Score</>}
          </button>
        </div>

        {result && tier && (
          <div className="space-y-4">
            <div className={'border-2 rounded-lg p-8 bg-white ' + tier.border}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="85" stroke="#e7e5e4" strokeWidth="12" fill="none" />
                    <circle cx="100" cy="100" r="85" stroke={tier.strokeColor} strokeWidth="12" fill="none"
                      strokeDasharray="534" strokeDashoffset={534 - (534 * displayScore / 100)} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={'text-6xl font-bold ' + tier.color}>{displayScore}</div>
                    <div className="text-sm text-stone-500">/ 100</div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className={'inline-block px-4 py-2 rounded-full font-bold text-sm mb-3 ' + tier.bg + ' ' + tier.color}>
                    {tier.label}
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {result.total_score >= 80 && (
                      <p className="text-sm text-slate-700 font-medium">
                        Strong messaging. Top tier.
                      </p>
                    )}
                    {result.total_score >= 60 && result.total_score < 80 && (
                      <>
                        <p className="text-sm text-slate-700 font-medium">
                          Above the credibility threshold. Room to strengthen.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {result.verifiability_score <= result.clarity_score && result.verifiability_score <= result.trust_score && `Weakest area: Verifiability (${result.verifiability_score}/10) - add numbers or sources`}
                          {result.clarity_score < result.verifiability_score && result.clarity_score < result.trust_score && `Weakest area: Clarity (${result.clarity_score}/10) - simplify and cut filler`}
                          {result.trust_score < result.clarity_score && result.trust_score < result.verifiability_score && `Weakest area: Trust (${result.trust_score}/10) - tone down the hype`}
                        </p>
                      </>
                    )}
                    {result.total_score < 60 && (
                      <>
                        <p className="text-sm text-slate-700 font-medium">
                          Below the threshold for credible messaging (60+)
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {result.verifiability_score <= result.clarity_score && result.verifiability_score <= result.trust_score && `Weakest area: Verifiability (${result.verifiability_score}/10) - add numbers or sources`}
                          {result.clarity_score < result.verifiability_score && result.clarity_score < result.trust_score && `Weakest area: Clarity (${result.clarity_score}/10) - simplify and cut filler`}
                          {result.trust_score < result.clarity_score && result.trust_score < result.verifiability_score && `Weakest area: Trust (${result.trust_score}/10) - tone down the hype`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={copyScoreToClipboard} className="w-full mt-6 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Score to Clipboard'}
              </button>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Breakdown <span className="text-sm font-normal text-stone-500">(scores out of 10)</span></h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold">{result.clarity_score}</div>
                  <div className="text-xs text-stone-600">Clarity</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold">{result.verifiability_score}</div>
                  <div className="text-xs text-stone-600">Verifiability</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold">{result.trust_score}</div>
                  <div className="text-xs text-stone-600">Trust</div>
                </div>
              </div>

              <div className="space-y-3 border-t-2 border-stone-200 pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                    <span>✏️</span> Clarity
                  </p>
                  <p className="text-sm text-slate-900 mt-1">{result.clarity_feedback}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                    <span>✓</span> Verifiability
                  </p>
                  <p className="text-sm text-slate-900 mt-1">{result.verifiability_feedback}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                    <span>🤝</span> Trust
                  </p>
                  <p className="text-sm text-slate-900 mt-1">{result.trust_feedback}</p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-stone-200 mt-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2">What to Improve</h4>
                <ul className="space-y-2">
                  {result.improvements?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.has_blacklisted_words && result.blacklist_note && (
                <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <p className="text-sm text-amber-900 font-medium">{result.blacklist_note}</p>
                </div>
              )}
            </div>

            {result.rewrite && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Suggested Rewrite</h3>
                <p className="text-slate-900 font-medium">"{result.rewrite}"</p>
              </div>
            )}

            {result.equity_note && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                <p className="text-xs font-bold text-purple-700 uppercase mb-2">Brand Equity Context</p>
                <p className="text-sm text-slate-900">{result.equity_note}</p>
              </div>
            )}

            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Want the full analysis?</h3>
              <p className="text-sm text-slate-600 mb-4">Get your complete MessageScore report emailed to you. Perfect for your swipe file.</p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleEmailReport}
                  disabled={!email || emailSent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300"
                >
                  {emailSent ? '✓ Sent' : 'Send Report'}
                </button>
              </div>
              
              {emailSent && (
                <p className="text-sm text-green-700 mt-2">Check your inbox! Report sent to {email}</p>
              )}
              
              {emailError && (
                <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{emailError}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageScore;