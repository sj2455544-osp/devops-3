import { create } from "zustand";

interface AuthModalData {
	courseName?: string;
	courseId?: number;
}

interface EnrollmentModalData {
	courseName?: string;
	courseId?: number;
}

interface EnrollmentClosedModalData {
	courseName?: string;
	courseId?: number;
}

interface ModalStore {
	// Auth Modal
	authModal: {
		isOpen: boolean;
		data?: AuthModalData;
	};

	// Enrollment Modal
	enrollmentModal: {
		isOpen: boolean;
		data?: EnrollmentModalData;
	};

	// Enrollment Closed Modal
	enrollmentClosedModal: {
		isOpen: boolean;
		data?: EnrollmentClosedModalData;
	};

	// Success Modal
	successModal: {
		isOpen: boolean;
		title?: string;
		message?: string;
	};

	// Forgot Password Modal
	forgotPasswordModal: {
		isOpen: boolean;
	};

	// Actions
	openAuthModal: (data?: AuthModalData) => void;
	openEnrollmentModal: (data?: EnrollmentModalData) => void;
	openEnrollmentClosedModal: (data?: EnrollmentClosedModalData) => void;
	openSuccessModal: (title?: string, message?: string) => void;
	openForgotPasswordModal: () => void;
	closeModal: () => void;

	// State checkers
	isAuthModalOpen: () => boolean;
	isEnrollmentModalOpen: () => boolean;
	isEnrollmentClosedModalOpen: () => boolean;
	isSuccessModalOpen: () => boolean;
	isForgotPasswordModalOpen: () => boolean;
	isAnyModalOpen: () => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
	authModal: { isOpen: false },
	enrollmentModal: { isOpen: false },
	enrollmentClosedModal: { isOpen: false },
	successModal: { isOpen: false },
	forgotPasswordModal: { isOpen: false },

	openAuthModal: (data) =>
		set(() => ({
			authModal: { isOpen: true, data },
			enrollmentModal: { isOpen: false },
			enrollmentClosedModal: { isOpen: false },
			successModal: { isOpen: false },
			forgotPasswordModal: { isOpen: false },
		})),

	openEnrollmentModal: (data) =>
		set(() => ({
			authModal: { isOpen: false },
			enrollmentModal: { isOpen: true, data },
			enrollmentClosedModal: { isOpen: false },
			successModal: { isOpen: false },
			forgotPasswordModal: { isOpen: false },
		})),

	openEnrollmentClosedModal: (data) =>
		set(() => ({
			authModal: { isOpen: false },
			enrollmentModal: { isOpen: false },
			enrollmentClosedModal: { isOpen: true, data },
			successModal: { isOpen: false },
			forgotPasswordModal: { isOpen: false },
		})),

	openSuccessModal: (title, message) =>
		set(() => ({
			authModal: { isOpen: false },
			enrollmentModal: { isOpen: false },
			enrollmentClosedModal: { isOpen: false },
			successModal: { isOpen: true, title, message },
			forgotPasswordModal: { isOpen: false },
		})),

	openForgotPasswordModal: () =>
		set(() => ({
			authModal: { isOpen: false },
			enrollmentModal: { isOpen: false },
			enrollmentClosedModal: { isOpen: false },
			successModal: { isOpen: false },
			forgotPasswordModal: { isOpen: true },
		})),

	closeModal: () =>
		set(() => ({
			authModal: { isOpen: false, data: undefined },
			enrollmentModal: { isOpen: false, data: undefined },
			enrollmentClosedModal: { isOpen: false, data: undefined },
			successModal: { isOpen: false, title: undefined, message: undefined },
			forgotPasswordModal: { isOpen: false },
		})),

	isAuthModalOpen: () => get().authModal.isOpen,
	isEnrollmentModalOpen: () => get().enrollmentModal.isOpen,
	isEnrollmentClosedModalOpen: () => get().enrollmentClosedModal.isOpen,
	isSuccessModalOpen: () => get().successModal.isOpen,
	isForgotPasswordModalOpen: () => get().forgotPasswordModal.isOpen,
	isAnyModalOpen: () => {
		const state = get();
		return state.authModal.isOpen || state.enrollmentModal.isOpen || state.enrollmentClosedModal.isOpen || state.successModal.isOpen || state.forgotPasswordModal.isOpen;
	},
}));
