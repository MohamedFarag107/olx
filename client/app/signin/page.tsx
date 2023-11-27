import SignInForm from "./_components/signIn-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In",
};

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-md w-full">
        <SignInForm />
      </div>
    </div>
  );
};

export default Page;
