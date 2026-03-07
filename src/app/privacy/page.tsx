"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-sm text-parchment-muted">
                        Last updated: March 3, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose-policy space-y-8 text-sm leading-relaxed text-parchment-muted">
                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            1. Introduction
                        </h2>
                        <p>
                            homerestyler (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to
                            protecting the personal data you share with us. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your information when you use our website and
                            services at homerestyler.app (the &quot;Service&quot;).
                        </p>
                        <p className="mt-2">
                            By using the Service, you agree to the collection and use of information in accordance
                            with this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            2. Information We Collect
                        </h2>
                        <h3 className="text-sm font-semibold text-parchment mt-4 mb-2">
                            2.1 Information You Provide
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong className="text-parchment">Account Information:</strong> When you sign in with
                                Google, we receive your name, email address, and profile picture from your Google
                                account.
                            </li>
                            <li>
                                <strong className="text-parchment">Uploaded Images:</strong> Room photos you upload for
                                AI-powered restyling. These are processed in real-time and are not stored permanently
                                on our servers unless you explicitly save them to your gallery.
                            </li>
                            <li>
                                <strong className="text-parchment">Gallery Items:</strong> Images you choose to save to
                                your personal gallery, along with associated metadata (style name, timestamps).
                            </li>
                            <li>
                                <strong className="text-parchment">Payment Information:</strong> Subscription and billing
                                information is processed by our payment partner, Lemon Squeezy. We do not directly
                                store your credit card numbers.
                            </li>
                        </ul>
                        <h3 className="text-sm font-semibold text-parchment mt-4 mb-2">
                            2.2 Information Collected Automatically
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong className="text-parchment">Usage Data:</strong> Credit consumption, generation
                                counts, feature usage, and session information.
                            </li>
                            <li>
                                <strong className="text-parchment">Device Information:</strong> Browser type, operating
                                system, screen resolution, and IP address.
                            </li>
                            <li>
                                <strong className="text-parchment">Cookies:</strong> We use essential cookies for
                                authentication and session management. No third-party advertising cookies are used.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            3. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>To provide, operate, and maintain the Service</li>
                            <li>To process your AI image generation requests</li>
                            <li>To manage your account, credits, and subscriptions</li>
                            <li>To store and display your saved gallery items</li>
                            <li>To communicate important service updates and changes</li>
                            <li>To detect and prevent fraud, abuse, and security incidents</li>
                            <li>To improve and optimize the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            4. Third-Party Services
                        </h2>
                        <p>We use the following third-party services:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li>
                                <strong className="text-parchment">Google (Authentication):</strong> For secure sign-in
                                via OAuth 2.0. Subject to{" "}
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold hover:underline"
                                >
                                    Google&apos;s Privacy Policy
                                </a>
                                .
                            </li>
                            <li>
                                <strong className="text-parchment">Supabase (Database &amp; Storage):</strong> For
                                storing your account data, credits, and gallery images. Data is encrypted at rest
                                and in transit.
                            </li>
                            <li>
                                <strong className="text-parchment">Google Gemini AI:</strong> For processing your room
                                images and generating restyled versions. Uploaded images are sent to Google&apos;s API
                                for processing.
                            </li>
                            <li>
                                <strong className="text-parchment">Lemon Squeezy (Payments):</strong> For processing
                                subscriptions and payments. Subject to{" "}
                                <a
                                    href="https://www.lemonsqueezy.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold hover:underline"
                                >
                                    Lemon Squeezy&apos;s Privacy Policy
                                </a>
                                .
                            </li>
                            <li>
                                <strong className="text-parchment">Vercel (Hosting):</strong> For serving the website.
                                Subject to{" "}
                                <a
                                    href="https://vercel.com/legal/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold hover:underline"
                                >
                                    Vercel&apos;s Privacy Policy
                                </a>
                                .
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            5. Data Retention
                        </h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong className="text-parchment">Account Data:</strong> Retained as long as your
                                account is active. Deleted within 30 days of account deletion request.
                            </li>
                            <li>
                                <strong className="text-parchment">Uploaded Images (non-saved):</strong> Processed in
                                real-time and not persisted after generation is complete.
                            </li>
                            <li>
                                <strong className="text-parchment">Gallery Images:</strong> Stored until you delete
                                them or request account deletion.
                            </li>
                            <li>
                                <strong className="text-parchment">Transaction History:</strong> Retained for accounting
                                and legal compliance purposes.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            6. Your Rights
                        </h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data and account</li>
                            <li>Export your gallery images</li>
                            <li>Withdraw consent for data processing</li>
                            <li>Lodge a complaint with a data protection authority</li>
                        </ul>
                        <p className="mt-2">
                            To exercise any of these rights, please contact us at the email address listed below.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            7. Security
                        </h2>
                        <p>
                            We implement industry-standard security measures including HTTPS encryption,
                            secure authentication tokens, Row Level Security on our database, and regular
                            security audits. However, no method of electronic transmission or storage is
                            100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            8. Children&apos;s Privacy
                        </h2>
                        <p>
                            The Service is not intended for users under 13 years of age. We do not knowingly
                            collect personal information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            9. Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any
                            changes by posting the new policy on this page and updating the &quot;Last updated&quot;
                            date. Continued use of the Service after changes constitutes acceptance of the
                            updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-parchment mb-3">
                            10. Contact Us
                        </h2>
                        <p>
                            For privacy-related questions or requests, please contact us at:{" "}
                            <a
                                href="mailto:privacy@homerestyler.app"
                                className="text-gold hover:underline"
                            >
                                privacy@homerestyler.app
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
