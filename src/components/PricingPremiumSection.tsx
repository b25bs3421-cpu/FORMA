import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  X, 
  Zap,
  Clock,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PricingPremiumSection() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate dates
  const today = new Date();
  const trialEndDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const formattedTrialEnd = trialEndDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const handleStartTrial = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubscribed(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  return (
    <section id="pricing" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
      
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-3">
          <span>Subscription &amp; Autopay</span>
          <span aria-hidden="true">·</span>
          <span>1 Month Free Trial</span>
          <span aria-hidden="true">·</span>
          <span>Cancel Anytime</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 text-balance">
          Transparent Pricing, Infinite Ideation
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty">
          Start with a full 1-month free trial. After your first month, autopay will be activated and 299 per month will be deducted from your account. You can pause or cancel anytime before day 30 with zero fees.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
        
        {/* Card 1: Starter / Free Explorer (4 cols) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Community Edition
            </div>
            <h3 className="text-2xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
              Starter
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-serif font-normal text-neutral-900 dark:text-neutral-100">
                0
              </span>
              <span className="text-xs font-mono text-neutral-500">/ forever</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Explore basic spatial whiteboarding and fundamental problem formulation tools with community features.
            </p>

            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Single active canvas with 25 nodes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Basic drawing pen and sticky notes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>1 document in knowledge assistant</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Standard prompt generation templates</span>
              </li>
            </ul>
          </div>

          <a
            href="#whiteboard"
            className="w-full py-3 text-center rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors block"
          >
            Continue Free
          </a>
        </div>

        {/* Card 2: Buy Premium (8 cols - Marquee Focus) */}
        <div className="lg:col-span-8 p-8 md:p-10 rounded-2xl bg-[#E2DFDA]/70 dark:bg-[#1A1A18] border-2 border-neutral-900 dark:border-neutral-100 shadow-xl relative flex flex-col justify-between space-y-8">
          
          {/* Top highlight label */}
          <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-[11px] font-mono uppercase tracking-wider font-medium shadow-md">
            1 Month Free · Autopay @ 299/mo
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Architectural Access</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
                FORMA Premium
              </h3>
            </div>

            {/* Pricing details */}
            <div className="p-6 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-300/80 dark:border-neutral-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-serif font-normal text-neutral-900 dark:text-neutral-100">
                    299
                  </span>
                  <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    / month (After 30-Day Free Trial)
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
                  Day 1 to 30: 100% Free (0 Due Today)
                </div>
              </div>

              {/* Autopay explanation notice */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Autopay Details:</strong> Your account will be charged <strong>0 today</strong>. Exactly after 1 month ({formattedTrialEnd}), recurring autopay of <strong>299 per month</strong> will be deducted from your account. An advance SMS and email alert is sent 3 days before any deduction. Cancel anytime online with 1 click.
                </span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                "Unlimited interactive whiteboard canvases",
                "Full 100,000 WebGL2 GPGPU particle physics simulation",
                "Causal DAG node links with 'Why Before What' validation",
                "Multi-document knowledge assistant (unlimited files)",
                "Verbatim passage citations & source grounding inspector",
                "Direct export to Markdown PRD, SVG, and high-res PNG",
                "Production zero-slop prompt generator for Gemini & Claude",
                "Priority client-side AST processing and early feature access"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-300/80 dark:border-neutral-800">
            <div className="text-xs font-mono text-neutral-500">
              <span>Next billing: {formattedTrialEnd} at 299</span>
              <span className="mx-2">·</span>
              <span>Cancel in 1 click</span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-xs font-mono font-medium hover:scale-105 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>Buy Premium · Start 1 Month Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Transparent Autopay & Guarantee Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400">
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100 block mb-0.5">1 Month 100% Free</strong>
            <span>Zero charges during your first 30 days. Experience full premium features risk-free.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100 block mb-0.5">Automated Autopay at 299/mo</strong>
            <span>Autopay seamlessly handles your monthly 299 renewal after day 30 with no interruption.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900 dark:text-neutral-100 block mb-0.5">Effortless Cancellation</strong>
            <span>Cancel with a single click in your account before day 30 and no deduction will ever occur.</span>
          </div>
        </div>
      </div>

      {/* Buy Premium Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-[#FAF9F6] dark:bg-[#181816] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-900 dark:text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Instant Autopay Mandate Setup
                </span>
                <h3 className="text-2xl font-serif font-medium mt-1">
                  Activate FORMA Premium
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsSubscribed(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {!isSubscribed ? (
              <div className="space-y-6 pt-5">
                {/* Order Summary Box */}
                <div className="p-4 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 border border-neutral-300/60 dark:border-neutral-700/60 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                    <span>Plan</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">FORMA Premium Monthly</span>
                  </div>
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                    <span>Trial Period</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">First 30 Days Free (0 Charged)</span>
                  </div>
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                    <span>Recurring Autopay Rate</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">299 / month (Starts {formattedTrialEnd})</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-300 dark:border-neutral-700 flex justify-between font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    <span>Due Today</span>
                    <span className="text-emerald-600 dark:text-emerald-400">0.00</span>
                  </div>
                </div>

                {/* Autopay Payment Method Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Select Autopay Mandate Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("upi")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPaymentMethod === "upi"
                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                          : "bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      UPI Autopay
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPaymentMethod === "card"
                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                          : "bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      Credit/Debit
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("netbanking")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPaymentMethod === "netbanking"
                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                          : "bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      e-Mandate
                    </button>
                  </div>
                </div>

                {/* Form Input Simulation */}
                {selectedPaymentMethod === "upi" && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-500 uppercase">
                      Enter UPI ID for Recurring Autopay (GPay, PhonePe, Paytm)
                    </label>
                    <input
                      type="text"
                      defaultValue="architect@okaxis"
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                )}

                {selectedPaymentMethod === "card" && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-500 uppercase">
                      Card Number for Recurring Billing
                    </label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                )}

                {selectedPaymentMethod === "netbanking" && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-500 uppercase">
                      Select Bank for e-NACH Autopay Mandate
                    </label>
                    <select className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none">
                      <option>HDFC Bank (Instant e-Mandate)</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}

                {/* Autopay Terms Confirmation */}
                <p className="text-[11px] text-neutral-500 font-mono leading-relaxed">
                  By clicking below, you authorize an autopay mandate. <strong>0 will be deducted today</strong>. After 1 month ({formattedTrialEnd}), <strong>299 will be deducted monthly</strong> until cancelled. Cancel anytime in your dashboard before day 30 with no charges.
                </p>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleStartTrial}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-xs font-mono font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <span>Authorizing Autopay Mandate...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Autopay &amp; Start 1 Month Free</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Success / Active Subscription State */
              <div className="pt-6 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
                    Premium Activated · 1 Month Free
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Welcome to FORMA Premium! 0 was deducted today. Your recurring autopay mandate of 299/month is active starting {formattedTrialEnd}.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subscription Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active (30-Day Free Trial)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">First Autopay Deduction:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">{formattedTrialEnd} (299)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Mandate ID:</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-mono">FORMA-AP-94821</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-xs font-mono font-medium hover:opacity-90"
                >
                  Return to Workspace
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
