"use client"
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useRouter} from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../Provider";
export default  function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); 
    }
  }, [isAuthenticated, router]);

  return (
    <main>

     <Header/>
      <LoginForm />
      <Footer/>
    </main>
  );
}