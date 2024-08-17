import ComplaintForm from "@/components/ComplaintForm";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Ruby Complaint Management</h1>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/signup">Sign Up</Link>
      <ComplaintForm />
    </div>
  );
};

export default Home;
