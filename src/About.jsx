import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const About = () => {
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
            <Link to="/about" className="text-sm font-semibold text-slate-900">About</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900">How It Works</Link>
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About MessageScore</h1>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">We don't grade on a curve. We grade on truth.</h2>
          <p className="text-lg text-slate-700 mb-8">Most marketing messages score under 40 on MessageScore. Yours probably does too.</p>
          <p className="text-lg text-slate-700 mb-8">That's not a bug. That's the point.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Problem</h2>
          <p className="text-slate-700 mb-4">Marketing measures everything. Click-through rates. Conversion rates. Cost per acquisition. Time on page. Bounce rates. ROI.</p>
          <p className="text-slate-700 mb-4">Everything has a metric—except the very thing that powers it all: <strong>the message itself</strong>.</p>
          <p className="text-slate-700 mb-4">You can A/B test a button color 100 times, but if your headline says "revolutionary AI-powered platform," no amount of optimization will save you.</p>
          <p className="text-slate-700 mb-4">Marketing has a credibility crisis. Every company claims they're "innovative," "best-in-class," and "transforming the industry." No one believes any of it anymore.</p>
          <p className="text-slate-700 mb-8">Your prospects aren't stupid. They can smell vague claims and empty promises from a mile away. But most marketers don't realize how bad their messaging is until it's already live and the campaign has already failed. Money burnt.</p>
          <p className="text-slate-700 mb-8">That's where MessageScore comes in.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Scoring Philosophy</h2>
          
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-green-900 mb-2">85-90+: Elite</p>
            <p className="text-sm text-slate-700">Named customer + precise metric + measurable outcome. Example: "Salesforce cut API errors by 61% in 8 weeks using our monitoring dashboard."</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-blue-900 mb-2">75-84: Strong</p>
            <p className="text-sm text-slate-700">Specific proof with a clear verification path. You're above the credibility threshold. One more pass and you're ready to ship.</p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-amber-900 mb-2">70-74: Good</p>
            <p className="text-sm text-slate-700">Close, but lacks specificity. Tighten the metric or add a named source.</p>
          </div>

          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-orange-900 mb-2">60-69: Needs Work</p>
            <p className="text-sm text-slate-700">Too vague. Name a customer or add a number. Anonymous social proof ("thousands of users") doesn't count.</p>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8">
            <p className="text-sm font-bold text-red-900 mb-2">Below 60: Weak</p>
            <p className="text-sm text-slate-700">Marketing speak with no proof. Start over. Lead with a specific, measurable outcome.</p>
          </div>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Built To Standard</h2>
          <p className="text-slate-700 mb-4">MessageScore isn't here to make you feel good. It's here to make your messaging work.</p>
          <p className="text-slate-700 mb-4">The average marketing message in the wild would score 20-50. Vague benefits, buzzwords, and unverifiable claims dominate most websites, ads, and landing pages.</p>
          <p className="text-slate-700 mb-4">Here's what happens when you try to score common marketing patterns:</p>

          <div className="bg-stone-100 border-2 border-stone-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-slate-700 mb-2">"Join 4,200 marketing teams using our platform" → <span className="font-bold text-red-600">48</span></p>
            <p className="text-xs text-slate-600">Why? Can't verify those 4,200 teams exist. Anonymous numbers aren't credible.</p>
          </div>

          <div className="bg-stone-100 border-2 border-stone-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-slate-700 mb-2">"Our AI-powered analytics help you make better decisions faster" → <span className="font-bold text-red-600">27</span></p>
            <p className="text-xs text-slate-600">Why? "Better" and "faster" are meaningless without context. No proof.</p>
          </div>

          <div className="bg-stone-100 border-2 border-stone-300 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-slate-700 mb-2">"The best-in-class solution for next-generation enterprises" → <span className="font-bold text-red-600">17</span></p>
            <p className="text-xs text-slate-600">Why? Every blacklisted buzzword in one sentence. Says nothing.</p>
          </div>

          <p className="text-slate-700 mb-4">Compare that to:</p>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-8">
            <p className="text-sm font-mono text-slate-700 mb-2">"Intercom cut their backlog from 4 days to 6 hours in the first week" → <span className="font-bold text-green-600">87</span></p>
            <p className="text-xs text-slate-600">Why? Named customer, precise before/after metric, timeframe. Can be fact-checked.</p>
          </div>

          <p className="text-slate-700 mb-4">See the difference?</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">What "Good" Actually Looks Like</h2>
          <p className="text-slate-700 mb-4">Most marketers think they need clever wordplay or emotional appeals. They don't.</p>
          <p className="text-slate-700 mb-4">They need <strong>named entities + precise numbers + measurable outcomes</strong>.</p>
          <p className="text-slate-700 mb-4">That's it. That's the formula.</p>
          <p className="text-slate-700 mb-4">Examples that score 75+:</p>

          <ul className="list-disc list-inside text-slate-700 mb-8 space-y-2">
            <li>"MongoDB reduced database query time from 2.3 seconds to 140ms"</li>
            <li>"Stripe recovered $2.3M in failed payments (case study inside)"</li>
            <li>"We helped Zendesk cut response time 73% (4.2hrs → 1.1hrs). Measured across 840K tickets"</li>
          </ul>

          <p className="text-slate-700 mb-8">No buzzwords. No hype. Just proof.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Brand Equity Exception</h2>
          <p className="text-slate-700 mb-4">There's one exception to the strict scoring: <strong>established brands with recognition</strong>.</p>
          <p className="text-slate-700 mb-4">"Just Do It" scores 34 for a new brand (too abstract, no grounding).</p>
          <p className="text-slate-700 mb-4">"Just Do It" scores 90+ for Nike (memorable, ownable, proven over decades).</p>
          <p className="text-slate-700 mb-8">Abstract, aspirational messaging works when you're Apple or Nike. If you're not, you need specificity.</p>

          <hr className="my-12 border-stone-300" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">This Is a Benchmark, Not a Celebration</h2>
          <p className="text-slate-700 mb-4">MessageScore isn't a tool that pats you on the back. It's a diagnostic.</p>
          <p className="text-slate-700 mb-4">If your score is low, don't take it personally. Most marketing messaging is bad. The industry has been optimizing for clever rather than clear, emotional rather than evidential.</p>
          <p className="text-slate-700 mb-8">Your job isn't to game the score. Your job is to <strong>say something true and specific</strong> that your audience can verify.</p>
          <p className="text-slate-700 mb-12">Do that, and the score takes care of itself.</p>

          <div className="bg-slate-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Find Out?</h2>
            <p className="text-slate-300 mb-2">Most marketing messages score under 40.</p>
            <p className="text-slate-300 mb-2">Strong messages score 75+.</p>
            <p className="text-slate-300 mb-6">Elite messages score 85+.</p>
            <p className="text-xl font-semibold mb-6">Where does yours land?</p>
            <Link to="/" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-stone-100">
              Score Your Message →
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

export default About;