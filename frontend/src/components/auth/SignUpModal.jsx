import { SignUp } from "@clerk/clerk-react";
import AuthModal from "./AuthModal";

const SignUpModal = ({ onClose }) => {
  return (
    <AuthModal
      title="Get Started"
      subtitle="Create your account to start analyzing food"
      onClose={onClose}
    >
      <SignUp 
        routing="hash" 
        afterSignUpUrl="/"
        appearance={{
          elements: {
            formButtonPrimary: "bg-cadetblue-500 hover:bg-cadetblue-600",
            card: "shadow-none"
          }
        }}
      />
    </AuthModal>
  );
};

export default SignUpModal;