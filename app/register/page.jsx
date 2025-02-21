"use client"
import { useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import {useRouter,replace } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../Provider";


export default  function Register() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard"); 
    }
  }, [isAuthenticated, router]);


  return (
  <>
  <Header/>
    <RegisterForm/>
    <Footer/>
  </>
);
}