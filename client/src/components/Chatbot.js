import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey Lota 👋, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [faqVisible, setFaqVisible] = useState(true);
  const chatRef = useRef();

  const faqSuggestions = [
    "How does your service work?",
    "Can I hire you as a developer?",
    "What is your pricing?",
    "Do you build full websites?",
  ];

  const sendMessage = (text, fromFAQ = false) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    if (fromFAQ) setFaqVisible(false);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Love that question! I'm working on it… 💡" },
      ]);
    }, 700);
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* OPEN BUTTON */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-gradient-to-r from-primary-pink to-primary-purple text-white p-4 rounded-full shadow-lg hover:shadow-xl"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* CHATBOX */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-80 md:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-primary-pink to-primary-purple text-white px-4 py-3 flex justify-between items-center">
              <h2 className="font-semibold">Chat with Lota AI</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* CHAT MESSAGES */}
            <div
              ref={chatRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
            >
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] text-sm rounded-2xl shadow 
                        ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* FAQ */}
              {faqVisible && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {faqSuggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q, true)}
                      className="bg-white text-primary-purple text-xs px-3 py-2 rounded-full border border-primary-purple hover:bg-primary-purple/10 transition font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* INPUT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 150 }}
              className="p-3 flex items-center gap-2 border-t bg-white"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message…"
                className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-purple focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-primary-pink to-primary-purple text-white px-4 py-2 rounded-xl hover:from-primary-purple hover:to-primary-pink transition"
              >
                <Send size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
