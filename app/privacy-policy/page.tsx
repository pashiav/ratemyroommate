"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/Footer';

// Privacy Policy page component with cute themed styling
const PrivacyPolicyPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-lightGray">
            {/* Header with back button */}
            <div className="bg-lightGray">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <Button 
                                variant="link"
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                        <div className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Rate My Roommate" className="w-12 h-8" />
                            <h1 className="text-1xl font-bold text-darkBlue font-lazyDog">Rate My Roommate</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Title section with cute styling */}
                <div className="bg-lightGray rounded-xl p-2 mb-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-darkBlue font-lazyDog mb-4">
                            Privacy Policy
                        </h1>
                        <div className="flex justify-center items-center space-x-4 text-[#a0a6bf]">
                            <div className="w-12 h-1 bg-[#e2a3a4] rounded-full"></div>
                            <span className="text-lg font-medium">Effective Date: January 2025</span>
                            <div className="w-12 h-1 bg-[#e2a3a4] rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Content sections */}
                <div className="bg-lightGray rounded-xl p-8 space-y-8">
                    <div className="text-center mb-8">
                        <p className="text-lg text-[#315d8d] leading-relaxed">
                            Rate My Roommate ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our roommate review platform.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Section 1 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">1</span>
                                Information We Collect
                            </h2>
                            <p className="text-[#315d8d] mb-3">
                                When you use Rate My Roommate, we may collect:
                            </p>
                            <ul className="space-y-2 text-[#315d8d]">
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>Account Information:</strong> Your verified .edu email, name, and school.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>Reviews & Content:</strong> The reviews you write, ratings you give, and housing details you share.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>Usage Data:</strong> Basic technical information (such as IP address, browser type, and device) to maintain security and improve performance.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">2</span>
                                How We Use Your Information
                            </h2>
                            <p className="text-[#315d8d] mb-3">
                                We use your information to:
                            </p>
                            <ul className="space-y-2 text-[#315d8d]">
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    Verify you are a student with a .edu email.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    Allow you to post and view roommate reviews at your school.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    Maintain the safety and reliability of the platform.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    Improve features and address issues.
                                </li>
                            </ul>
                            <p className="text-[#315d8d] mt-3 font-semibold">
                                We do not sell your personal information.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">3</span>
                                Sharing of Information
                            </h2>
                            <p className="text-[#315d8d] mb-3">
                                We may share limited information only when:
                            </p>
                            <ul className="space-y-2 text-[#315d8d]">
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>With other students:</strong> Reviews you post will be visible to verified students at your school.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>With service providers:</strong> We use third-party services such as Clerk (for authentication) and Supabase (for database hosting). They process your data only to provide their services.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    <div>
                                        <strong>For legal reasons:</strong> If required by law or to protect our rights and community.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">4</span>
                                Your Choices
                            </h2>
                            <ul className="space-y-2 text-[#315d8d]">
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    You can edit or delete your reviews at any time.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    You may request account deletion by contacting us through our GitHub repository.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#e2a3a4] mr-2">•</span>
                                    If you delete your account, your past reviews may remain visible to preserve the integrity of the platform.
                                </li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">5</span>
                                Data Security
                            </h2>
                            <p className="text-[#315d8d]">
                                We use measures such as Row Level Security in our database, input validation, and .edu verification to help protect your data. However, no online service can be guaranteed to be completely secure.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">6</span>
                                Children's Privacy
                            </h2>
                            <p className="text-[#315d8d]">
                                This platform is intended for college students. We do not knowingly collect information from anyone under 13.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">7</span>
                                Changes to This Policy
                            </h2>
                            <p className="text-[#315d8d]">
                                We may update this Privacy Policy from time to time. When we do, we will update the "Effective Date" above.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="rounded-lg p-6 border-2 border-[#1e3a8a] border-l-8">
                            <h2 className="text-2xl font-bold text-[#1e3a8a] font-lazyDog mb-4 flex items-center">
                                <span className="bg-[#e2a3a4] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">8</span>
                                Contact Us
                            </h2>
                            <p className="text-[#315d8d] mb-4">
                                If you have questions or concerns about this Privacy Policy, you can contact us by opening an issue or discussion on our GitHub repository:
                            </p>
                            <a 
                                href="https://github.com/pashiav/ratemyroommate" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 4.624-5.479 4.869.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>Visit GitHub Repository</span>
                            </a>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="text-center mt-12 pt-8 border-t-2 border-[#e2a3a4]">
                        <p className="text-[#a0a6bf] text-lg">
                            Thanks for being part of the Rate My Roommate community!
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </main>
    );
};

export default PrivacyPolicyPage;