import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-900 hover:text-slate-700">
            <img src="/messagescore-logo.png" alt="MessageScore" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">MessageScore</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900">About</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-900">How It Works</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Tool
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h1>
          <p className="text-xl text-slate-700 mb-12">MessageScore evaluates your messaging using the same criteria your audience unconsciously applies when deciding whether to trust you.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">The CVT Framework</h2>

          {/* Clarity */}
          <div className="bg-white border-2 border-stone-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">✏️ Clarity</h3>
            <p className="text-slate-700 mb-4"><strong>Can a 12-year-old understand what you do?</strong></p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
              <p className="text-sm font-semibold text-green-900 mb-1">✅ Good Example</p>
              <p className="text-sm text-slate-700">"Cut support response time from 4 hours to 12 minutes"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm font-semibold text-red-900 mb-1">❌ Bad Example</p>
              <p className="text-sm text-slate-700">"Leverage AI-powered solutions to optimize workflows"</p>
            </div>

            <p className="text-sm text-slate-600 mt-4">Clarity means no jargon, no vague benefits, no buzzwords. If your message requires a second read to understand, it fails the clarity test.</p>
          </div>

          {/* Verifiability */}
          <div className="bg-white border-2 border-stone-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">✓ Verifiability</h3>
            <p className="text-slate-700 mb-4"><strong>Can someone fact-check your claim?</strong></p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
              <p className="text-sm font-semibold text-green-900 mb-1">✅ Good Example</p>
              <p className="text-sm text-slate-700">"Intercom cut their backlog from 4 days to 6 hours"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm font-semibold text-red-900 mb-1">❌ Bad Example</p>
              <p className="text-sm text-slate-700">"Join thousands of happy customers"</p>
            </div>

            <p className="text-sm text-slate-600 mt-4">Verifiability means named customers, specific numbers, cited sources. "Thousands of users" can't be verified. "Salesforce cut API errors by 61%" can be.</p>
          </div>

          {/* Trust */}
          <div className="bg-white border-2 border-stone-200 rounded-lg p-6 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-3">🤝 Trust</h3>
            <p className="text-slate-700 mb-4"><strong>Does it sound desperate or confident?</strong></p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
              <p className="text-sm font-semibold text-green-900 mb-1">✅ Good Example</p>
              <p className="text-sm text-slate-700">"Used by 200+ dev teams processing 50M requests daily"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm font-semibold text-red-900 mb-1">❌ Bad Example</p>
              <p className="text-sm text-slate-700">"Revolutionary platform transforming the industry"</p>
            </div>

            <p className="text-sm text-slate-600 mt-4">Trust means you sound grounded, not hyped. Desperate claims ("revolutionary," "game-changing") destroy credibility. Confident claims are backed by proof.</p>
          </div>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Happens When You Score</h2>

          <div className="space-y-6 mb-12">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 mb-2">You get a total score (0-100)</p>
                <p className="text-sm text-slate-700">Based on how well your message performs across Clarity, Verifiability, and Trust.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 mb-2">Individual scores for each dimension</p>
                <p className="text-sm text-slate-700">See exactly where your message is weak: vague claims, no proof, or hyped language.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 mb-2">Specific, actionable feedback</p>
                <p className="text-sm text-slate-700">Not generic advice. Sharp, witty feedback that references your actual message content.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 mb-2">What to improve (and how)</p>
                <p className="text-sm text-slate-700">Concrete actions: "Name a customer" or "Replace 'better' with a specific metric"</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 mb-2">A suggested rewrite (if you score below 70)</p>
                <p className="text-sm text-slate-700">We show you what the message could be: specific, verifiable, trustworthy.</p>
              </div>
            </div>
          </div>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Blacklisted Words</h2>
          <p className="text-slate-700 mb-4">Certain words are red flags. They signal empty marketing speak and automatically lower your score:</p>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-4">
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              <li>• Innovative</li>
              <li>• Cutting-edge</li>
              <li>• Game-changing</li>
              <li>• Revolutionary</li>
              <li>• Best-in-class</li>
              <li>• Next-generation</li>
            </ul>
          </div>

          <p className="text-slate-700 mb-8">These words say nothing. They're filler. Delete them and replace with specific proof.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">The Formula for High Scores</h2>
          <p className="text-slate-700 mb-4">For proof-based messaging (value propositions, features, case studies, product descriptions), messages that score 75+ follow a simple pattern:</p>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <p className="text-lg font-semibold text-blue-900 mb-4 text-center">Named Entity + Precise Number + Measurable Outcome</p>
            <p className="text-sm text-slate-700 text-center">This formula works when you're making claims about results.</p>
          </div>

          <p className="text-slate-700 mb-4">Examples:</p>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li><strong>MongoDB</strong> reduced database query time from <strong>2.3 seconds to 140ms</strong></li>
            <li><strong>Stripe</strong> recovered <strong>$2.3M</strong> in failed payments</li>
            <li><strong>Zendesk</strong> cut response time <strong>73%</strong> (4.2hrs → 1.1hrs)</li>
          </ul>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-8">
            <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Important Note</p>
            <p className="text-sm text-slate-700">This formula applies to <strong>proof-based messaging</strong>—when you're making claims about results, outcomes, or capabilities.</p>
            <p className="text-sm text-slate-700 mt-2">Brand messaging (taglines, positioning statements) follows different rules: <strong>memorability over metrics</strong>. Abstract, aspirational messaging can score high for established brands with recognition (Nike's "Just Do It"), but new brands need grounding and specificity.</p>
          </div>

          <p className="text-slate-700 mb-4"><strong>When does the formula work?</strong></p>
          <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">
            <li>Value propositions</li>
            <li>Feature highlights</li>
            <li>Case studies and proof points</li>
            <li>Product descriptions (when making claims)</li>
            <li>Cold outreach</li>
            <li>Sales deck intros</li>
          </ul>

          <p className="text-slate-700 mb-4"><strong>When does it not apply?</strong></p>
          <ul className="list-disc list-inside text-slate-700 mb-12 space-y-1">
            <li>Taglines for established brands (emotion over proof)</li>
            <li>Email subject lines (curiosity + specificity)</li>
            <li>Calls-to-action (clarity of action, not proof)</li>
            <li>Brand positioning statements</li>
          </ul>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why We Built This</h2>
          <p className="text-slate-700 mb-4">Marketing measures everything—CTR, CPA, conversion rates—except the words themselves.</p>
          <p className="text-slate-700 mb-4">MessageScore fills that gap. It's the first diagnostic tool that treats your message as a measurable, improvable asset.</p>
          <p className="text-slate-700 mb-12">Because if your words don't work, nothing else matters.</p>

          <div className="bg-slate-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Score Your Message?</h2>
            <p className="text-slate-300 mb-6">See where you stand. Get actionable feedback. Improve your messaging instantly.</p>
            <Link to="/" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-stone-100">
              Try MessageScore →
            </Link>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-stone-200 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-slate-600">
          <p>MessageScore is a diagnostic tool for marketing messaging.</p>
          <p className="mt-2">Built by marketers who are tired of buzzwords. Scored by the CVT Framework: Clarity, Verifiability, Trust.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;