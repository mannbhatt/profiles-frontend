"use client";
import React, { useState, useEffect } from "react";
import ProfileForm from "./profileForm";
import EducationForm from "./educationForm";
import ExperienceForm from "./experienceForm";
import Header from "../components/header";
import Footer from "../components/footer";
import { jwtDecode } from "jwt-decode";

export default function Details() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        setUserId(decodedToken["id"]);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };
const thisStep=()=>{
  setStep(step);
}
  const skipStep = () => {
    setStep(step + 1);
  };

  return (
    <div>
      <Header />
      {step === 1 && <ProfileForm userId={userId} nextStep={nextStep}  skipStep={skipStep} />}
      {step === 2 && <EducationForm userId={userId} nextStep={nextStep} thisStep={thisStep} skipStep={skipStep} />}
      {step === 3 && <ExperienceForm userId={userId} nextStep={nextStep} thisStep={thisStep} skipStep={skipStep} />}
      <Footer />
    </div>
  );
}
