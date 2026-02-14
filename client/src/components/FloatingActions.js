import { AnimatePresence, motion } from "framer-motion";
import { Headset, MessageCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import Chatbot from "./Chatbot";

const FloatingActions = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false); // speed dial
  const [chatOpen, setChatOpen] = useState(false); // chatbot visibility
  const containerRef = useRef(null);

  const whatsappNumber = "237674772569";
  const defaultMsg = t("whatsappMessage");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMsg
  )}`;

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    }),
  };

  // Toggle FAB speed dial
  const toggleFAB = () => {
    if (chatOpen) {
      // If chatbot is open, close it and reopen speed dial
      setChatOpen(false);
      setOpen(true);
    } else {
      setOpen((prev) => !prev);
    }
  };

  // Open Chatbot
  const openChat = () => {
    setOpen(false);
    setChatOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
    >
      {/* Chatbot popup */}
      <AnimatePresence>
        {chatOpen && (
          <Chatbot
            key="chatbot"
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Speed dial buttons */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="speedDial"
            className="flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
              custom={0}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={buttonVariants}
            >
              <FaWhatsapp size={22} />
            </motion.a>

            <motion.button
              onClick={openChat}
              className="bg-gradient-to-r from-primary-pink to-primary-purple text-white p-4 rounded-full shadow-lg hover:opacity-90 transition"
              custom={1}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={buttonVariants}
            >
              <MessageCircle size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={toggleFAB}
        className="bg-primary-purple text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {open ? <X size={26} /> : <Headset size={26} />}
        </motion.div>
      </button>
    </div>
  );
};

export default FloatingActions;
