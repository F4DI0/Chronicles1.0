import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AiOutlineLogin, AiOutlineSearch, AiOutlineRead, AiOutlineStar } from "react-icons/ai";
import { FaBookOpen, FaUserEdit, FaRegComments, FaRegHeart } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2D2420] text-white overflow-x-auto">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-auto z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8B5E3C] opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
            }}
            animate={{
              y: [0, Math.random() * 80 - 40],
              x: [0, Math.random() * 80 - 40],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="w-full flex items-center justify-between px-6 py-4 fixed top-0 bg-[#1E130E]/30 backdrop-blur-lg z-50 border-b border-[#3E2723]/30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.img 
            src="/logo.png" 
            alt="Chronicles Logo" 
            className="w-10 h-10" 
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring" }}
          />
          <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#F5E6C8] to-[#A67B5B] bg-clip-text text-transparent">
            Chronicles
          </h1>
        </motion.div>
        <div className="flex gap-4">
          <motion.button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#8B5E3C] text-[#F5E6C8] rounded-full hover:bg-[#8B5E3C]/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AiOutlineLogin />
            <span>Login</span>
          </motion.button>
          <motion.button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5E3C] to-[#A67B5B] text-white rounded-full hover:shadow-lg hover:shadow-[#8B5E3C]/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserEdit />
            <span>Sign Up</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#8B5E3C] opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-[#F5E6C8] via-[#A67B5B] to-[#F5E6C8] bg-clip-text text-transparent">
              A Library where you can Raise your Voice.
            </span>
          </motion.h2>
          
          <motion.p
            className="text-[#E4C9A8] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Chronicles is where book lovers unite. Explore new worlds, share your thoughts, and connect with fellow readers in a vibrant literary community.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 bg-gradient-to-r from-[#8B5E3C] to-[#A67B5B] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#8B5E3C]/50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 94, 60, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserEdit />
              Get Started
            </motion.button>
            <motion.button
              onClick={() => navigate("/explore")}
              className="px-8 py-3 bg-transparent border border-[#8B5E3C] text-[#F5E6C8] rounded-full font-medium hover:bg-[#8B5E3C]/20 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AiOutlineSearch />
              Explore Books
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#1E130E]/50 to-[#0F0F0F]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#F5E6C8] to-[#A67B5B] bg-clip-text text-transparent">
              Why Choose Chronicles?
            </h2>
            <p className="text-[#E4C9A8] max-w-2xl mx-auto">
              We've built the perfect platform for book enthusiasts with features designed to enhance your reading experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1E130E]/50 border border-[#3E2723]/30 rounded-xl p-8 backdrop-blur-sm hover:border-[#8B5E3C]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
              >
                <div className="text-[#F5E6C8] text-4xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#F5E6C8] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#E4C9A8]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0F0F0F]/50 to-[#1E130E]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#F5E6C8] to-[#A67B5B] bg-clip-text text-transparent">
              What Our Readers Say
            </h2>
            <p className="text-[#E4C9A8] max-w-2xl mx-auto">
              Join thousands of happy readers who've found their literary home.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-[#1E130E]/50 border border-[#3E2723]/30 rounded-xl p-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex items-center gap-2 text-[#F5E6C8] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <AiOutlineStar key={i} className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : ""} />
                  ))}
                </div>
                <p className="text-[#E4C9A8] italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8B5E3C]/30 flex items-center justify-center">
                    <span className="text-xl">{testimonial.emoji}</span>
                  </div>
                  <div>
                    <h4 className="text-[#F5E6C8] font-medium">{testimonial.name}</h4>
                    <p className="text-[#E4C9A8] text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#1E130E]/20 backdrop-blur-sm z-0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="bg-gradient-to-r from-[#F5E6C8] via-[#A67B5B] to-[#F5E6C8] bg-clip-text text-transparent">
              Ready to Begin Your Literary Journey?
            </span>
          </motion.h2>
          
          <motion.p
            className="text-[#E4C9A8] text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Join Chronicles today and discover a world of books, discussions, and like-minded readers.
          </motion.p>
          
          <motion.button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-[#8B5E3C] to-[#A67B5B] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#8B5E3C]/50 transition-all duration-300 flex items-center gap-2 text-lg mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserEdit />
            Sign Up Free
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] py-12 px-6 border-t border-[#1E130E]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Chronicles Logo" className="w-10 h-10" />
                <h3 className="text-xl font-bold tracking-wide bg-gradient-to-r from-[#F5E6C8] to-[#A67B5B] bg-clip-text text-transparent">
                  Chronicles
                </h3>
              </div>
              <p className="text-[#E4C9A8] text-sm">
                The ultimate platform for book lovers to discover, share, and connect.
              </p>
            </div>
            
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h4 className="text-[#F5E6C8] font-medium mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-[#E4C9A8] hover:text-[#F5E6C8] text-sm transition-colors duration-300">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#1E130E] mt-12 pt-8 text-center md:text-left">
            <p className="text-[#E4C9A8] text-sm">
              © {new Date().getFullYear()} Chronicles. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const features = [
  {
    icon: <FaBookOpen />,
    title: "Vast Library",
    description: "Access thousands of books across all genres with detailed information and reader reviews."
  },
  {
    icon: <FaRegComments />,
    title: "Engaging Discussions",
    description: "Join book clubs and discussion threads to share your thoughts with fellow readers."
  },
  {
    icon: <AiOutlineRead />,
    title: "Reading Challenges",
    description: "Participate in monthly reading challenges to discover new books and authors."
  },
  {
    icon: <FaRegHeart />,
    title: "Personalized Recommendations",
    description: "Get tailored book suggestions based on your reading history and preferences."
  }
];

const testimonials = [
  {
    quote: "Chronicles has completely transformed how I discover and engage with books. The community is amazing!",
    name: "Sarah Johnson",
    role: "Avid Reader",
    rating: 5,
    emoji: "📚"
  },
  {
    quote: "As a book club organizer, this platform has made it so easy to manage our group and find new reads.",
    name: "Michael Chen",
    role: "Book Club Leader",
    rating: 4,
    emoji: "👓"
  },
  {
    quote: "I've doubled my reading since joining Chronicles. The challenges keep me motivated!",
    name: "Emma Rodriguez",
    role: "Casual Reader",
    rating: 5,
    emoji: "☕"
  }
];

const footerLinks = [
  {
    title: "Explore",
    links: [
      { text: "Popular Books", href: "#" },
      { text: "New Releases", href: "#" },
      { text: "Genres", href: "#" }
    ]
  },
  {
    title: "Community",
    links: [
      { text: "Book Clubs", href: "#" },
      { text: "Discussions", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { text: "About Us", href: "#" },
      { text: "Privacy Policy", href: "#" }
    ]
  }
];

export default LandingPage;