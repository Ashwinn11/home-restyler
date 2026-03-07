"use client";

import Link from "next/link";

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="mt-2 text-sm text-parchment-muted">
                        Last updated: March 3, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-sm leading-relaxed text-parchment-muted">
                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using HomeRestyler (&quot;the Service&quot;), you agree to be bound by
                            these Terms of Service. If you do not agree to these terms, please do not use the service.
                        </p>

                        <h3 className="text-parchment font-medium text-lg mt-8 mb-4 uppercase tracking-wider">1. Description of Service</h3>
                        <p className="text-parchment-muted font-light leading-relaxed">
                            HomeRestyler is an AI-powered interior design tool that allows users to upload
                            room photographs and generate AI-redesigned versions in various styles. The Service
                            includes image generation, refinement, variation generation, gallery storage, and
                            related features.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            2. User Accounts
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>You must sign in via Google OAuth to use the Service.</li>
                            <li>You are responsible for maintaining the security of your account.</li>
                            <li>You must provide accurate, current information.</li>
                            <li>One account per person; sharing accounts is prohibited.</li>
                            <li>
                                We reserve the right to suspend or terminate accounts that violate
                                these terms.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            3. Credits System
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>New accounts receive 25 free credits upon registration.</li>
                            <li>
                                Credits are consumed based on the computational resources (tokens) used for
                                each AI generation. Credits are deducted after a successful generation.
                            </li>
                            <li>
                                Credits are non-transferable and cannot be exchanged for cash.
                            </li>
                            <li>
                                Unused credits from free sign-up bonuses do not expire. Subscription credits
                                reset at each billing cycle.
                            </li>
                            <li>
                                We do not guarantee any specific number of generations per credit, as
                                token usage varies by request complexity.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            4. Subscriptions &amp; Payments
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                Paid subscriptions are billed monthly at the rate selected during checkout.
                            </li>
                            <li>
                                Subscriptions automatically renew unless cancelled before the renewal date.
                            </li>
                            <li>
                                All payments are processed securely through Lemon Squeezy. We do not store
                                your payment details.
                            </li>
                            <li>
                                Prices are subject to change with 30 days&apos; prior notice.
                            </li>
                            <li>
                                You may cancel your subscription at any time from your profile page. Cancellation
                                takes effect at the end of the current billing period.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            5. Acceptable Use
                        </h2>
                        <p className="mb-2">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Upload images you do not have rights to use</li>
                            <li>Upload images containing illegal, harmful, or explicit content</li>
                            <li>Attempt to reverse-engineer or manipulate the AI models</li>
                            <li>Use automated tools or bots to access the Service</li>
                            <li>Resell, redistribute, or sublicense access to the Service</li>
                            <li>
                                Attempt to exploit or circumvent the credit system or billing
                            </li>
                            <li>Use the Service for any unlawful purpose</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            6. Intellectual Property
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong className="text-parchment">Your Content:</strong> You retain all rights to the
                                original images you upload. By uploading, you grant us a limited license to
                                process them for the purpose of providing the Service.
                            </li>
                            <li>
                                <strong className="text-parchment">Generated Content:</strong> AI-generated images
                                produced by the Service are provided for your personal and commercial use.
                                However, we do not guarantee exclusivity of generated designs.
                            </li>
                            <li>
                                All content, tools, and services provided by HomeRestyler, including all
                                design, code, models, and branding, is owned by HomeRestyler and protected
                                by international copyright and trademark laws.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            7. Disclaimers
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
                            </li>
                            <li>
                                AI-generated images are artistic interpretations and should not be used as
                                architectural or construction plans.
                            </li>
                            <li>
                                We do not guarantee the accuracy, quality, or suitability of generated images
                                for any particular purpose.
                            </li>
                            <li>
                                Generated results may vary and are dependent on the quality of input images
                                and the capabilities of the underlying AI model.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            8. Limitation of Liability
                        </h2>
                        <p>
                            To the maximum extent permitted by law, HomeRestyler shall not be liable for any
                            indirect, incidental, special, or consequential damages resulting from the use
                            or inability to use the service. Our total liability shall not exceed the amount you
                            paid to us in the 12 months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            10. Termination
                        </h2>
                        <p>
                            We may terminate or suspend your access to the Service immediately, without prior
                            notice, for conduct that we believe violates these Terms or is harmful to other
                            users, us, or third parties ​— or for any other reason at our sole discretion.
                            Upon termination, your right to use the Service ceases immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            11. Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify users of
                            material changes by posting the updated terms with a new &quot;Last updated&quot; date.
                            Continued use of the Service after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            12. Governing Law
                        </h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the
                            jurisdiction in which the Service operator is established, without regard to conflict
                            of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            13. Contact
                        </h2>
                        <p>
                            For questions about these Terms, contact us at:{" "}
                            <a
                                href="mailto:legal@homerestyler.app"
                                className="text-gold hover:underline"
                            >
                                legal@homerestyler.app
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
