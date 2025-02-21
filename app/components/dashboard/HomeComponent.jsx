import { Users, UserCircle, TrendingUp, Activity } from "lucide-react"
import Hero from '../LandingPage/hero';
import Swiper from '../LandingPage/swiper'
import Features from "../LandingPage/feature";
import FAQSection from "../LandingPage/faqs";
import { motion } from 'framer-motion';

export default function HomeComponent() {
  const stats = [
    {
      title: "Total Profiles",
      value: "1,234",
      icon: Users,
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Active Users",
      value: "856",
      icon: UserCircle,
      change: "+5%",
      changeType: "increase",
    },
    {
      title: "Profile Views",
      value: "45.2K",
      icon: TrendingUp,
      change: "+18%",
      changeType: "increase",
    },
    {
      title: "Daily Active",
      value: "342",
      icon: Activity,
      change: "-3%",
      changeType: "decrease",
    },
  ]

  return (
    <div>
      <Hero/>
      <Swiper/>
      <Features/>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" py-12 items-center"
      >
        <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-center font-bold text-gray-900 sm:text-4xl">Dashboard Overview</h1>
          <p className="mt-2 text-center text-gray-600">Welcome back! Here's what's happening with your profiles.</p>
        </div>
      </motion.div>

    
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.3 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
        
      </motion.div>

        <FAQSection/>
         </div>
  )
}

