"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-ink">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="text-xs font-medium text-gold hover:text-gold-soft transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="mt-4 font-display text-3xl font-semibold text-parchment sm:text-4xl">
                        Refund Policy
                    </h1>
                    <p className="mt-2 text-sm text-parchment-muted">
                        Last updated: March 3, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-sm leading-relaxed text-parchment-muted">
                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            1. Overview
                        </h2>
                        <p>
                            We want you to be satisfied with Home Restyler. If you&apos;re not happy with your
                            subscription, we offer a straightforward refund policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            2. Subscription Refunds
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong className="text-parchment">Within 7 days of first subscription:</strong> Full
                                refund available if you have used fewer than 20% of your subscription credits. Contact
                                us to request a refund.
                            </li>
                            <li>
                                <strong className="text-parchment">After 7 days or 20%+ usage:</strong> No refunds for
                                the current billing period. You may cancel to prevent future charges and continue
                                using the Service until the end of your current billing period.
                            </li>
                            <li>
                                <strong className="text-parchment">Plan upgrades:</strong> Pro-rated credits are applied
                                to your new plan. No cash refund for the difference.
                            </li>
                            <li>
                                <strong className="text-parchment">Plan downgrades:</strong> Take effect at the next
                                billing cycle. No refund for the current period.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            3. Free Credits
                        </h2>
                        <p>
                            The 25 free credits provided on sign-up have no monetary value and are not
                            eligible for refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            4. Service Issues
                        </h2>
                        <p>
                            If you experience technical issues that result in credit loss (e.g., failed
                            generations where credits were deducted), please contact us within 48 hours.
                            We will review your case and may issue credit refunds (added back to your account)
                            at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            5. How to Request a Refund
                        </h2>
                        <div className="rounded-lg border border-parchment-faint/10 bg-ink-raised p-5">
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>
                                    Email us at{" "}
                                    <a
                                        href="mailto:billing@homerestyler.app"
                                        className="text-gold hover:underline"
                                    >
                                        billing@homerestyler.app
                                    </a>{" "}
                                    with your account email and reason for the refund request.
                                </li>
                                <li>
                                    Include your subscription plan and approximate sign-up date.
                                </li>
                                <li>
                                    We will review and respond within 3 business days.
                                </li>
                                <li>
                                    Approved refunds are processed within 5-10 business days.
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            6. Cancellation
                        </h2>
                        <p>
                            You can cancel your subscription anytime from your{" "}
                            <Link href="/profile" className="text-gold hover:underline">
                                profile page
                            </Link>
                            . Cancellation stops future billing but you retain access to your credits and
                            subscription features until the end of the current billing period.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            7. Exceptions
                        </h2>
                        <p>
                            We reserve the right to deny refund requests in cases of suspected abuse,
                            violation of our Terms of Service, or fraudulent activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            8. Contact
                        </h2>
                        <p>
                            For billing questions or refund requests:{" "}
                            <a
                                href="mailto:billing@homerestyler.app"
                                className="text-gold hover:underline"
                            >
                                billing@homerestyler.app
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
