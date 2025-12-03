import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { fetchMyMessages } from "../api";
import { useAuth } from "../context/AuthContext";

const SalonMessagesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const { data } = await fetchMyMessages();
        setConversations(data);
        if (data && data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        setError(t("salonmessages.loadFailed"));
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [t]);

  const getOtherParticipant = (convo) => {
    if (!convo || !user) return { name: t("salonmessages.unknown") };
    return convo.participants.find((p) => p._id !== user._id);
  };

  const getLastMessage = (convo) => {
    if (!convo.messages || convo.messages.length === 0)
      return t("salonmessages.noMessagesYet");
    return convo.messages[convo.messages.length - 1].text;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg">{t("salonmessages.errorTitle")}</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("salonmessages.title")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <div
                key={convo._id}
                onClick={() => setSelectedConversation(convo)}
                className={`p-4 border-b cursor-pointer ${
                  selectedConversation?._id === convo._id
                    ? "bg-purple-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">
                    {getOtherParticipant(convo)?.name}
                  </p>
                </div>
                <p className="text-sm text-text-muted truncate">
                  {getLastMessage(convo)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(convo.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-text-muted">
              {t("salonmessages.noConversations")}
            </p>
          )}
        </div>

        <div className="md:col-span-3 bg-white rounded-lg shadow-sm flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b font-bold text-lg">
                {getOtherParticipant(selectedConversation)?.name}
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender === user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                        msg.sender === user._id
                          ? "bg-primary-purple text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("salonmessages.typeMessage")}
                    className="w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-purple hover:text-primary-pink">
                    <FaPaperPlane size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              <p>{t("salonmessages.selectConversation")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonMessagesPage;
