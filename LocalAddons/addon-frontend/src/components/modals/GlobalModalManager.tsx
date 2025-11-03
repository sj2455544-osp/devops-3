"use client";

import React from "react";
import { useModalStore } from "@/stores/modalStore";
import AuthModal from "./AuthModal";
import EnrollmentClosedModal from "./EnrollmentClosedModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

const GlobalModalManager = () => {
	const { authModal, enrollmentModal, enrollmentClosedModal, successModal, forgotPasswordModal, closeModal } = useModalStore();

	return (
		<>
			{/* Auth Modal */}
			{authModal.isOpen && <AuthModal isOpen={authModal.isOpen} onClose={closeModal} />}

			{/* Enrollment Closed Modal */}
			{enrollmentClosedModal.isOpen && <EnrollmentClosedModal isOpen={enrollmentClosedModal.isOpen} onClose={closeModal} />}

			{/* Forgot Password Modal */}
			{forgotPasswordModal.isOpen && <ForgotPasswordModal isOpen={forgotPasswordModal.isOpen} onClose={closeModal} />}

			{/* Success Modal */}
			{successModal.isOpen && (
				<div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
					{/* Overlay */}
					<div className="absolute inset-0" onClick={closeModal}></div>

					{/* Mobile-friendly scrollable container */}
					<div className="w-full h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto flex items-center justify-center p-4">
						<div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 p-6 sm:p-8 my-4 sm:my-8">
							<div className="text-center">
								<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
									<svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<h3 className="text-lg sm:text-xl font-bold text-white mb-2">{successModal.title || "Success!"}</h3>
								<p className="text-sm sm:text-base text-slate-400 mb-6 leading-relaxed">{successModal.message || "Your action was completed successfully."}</p>
								<button
									onClick={closeModal}
									className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-green-500/20"
								>
									Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default GlobalModalManager;
