import { SignIn } from "@clerk/clerk-react";
import AuthModal from "./AuthModal";

const SignInModal = ({ onClose }) => {
  return (
    <AuthModal
      title="Welcome Back"
      subtitle="Sign in to analyze your food images"
      onClose={onClose}
    >
      <SignIn 
        routing="hash" 
        afterSignInUrl="/"
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

export default SignInModal;