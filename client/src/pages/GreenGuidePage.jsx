import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Leaf, 
  RefreshCw, 
  Bot, 
  User as UserIcon,
  HelpCircle,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { askGreenGuideApi } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ErrorMessage from '../components/common/ErrorMessage';

const PRESET_QUERIES = [
  'I need reusable kitchen products under ₹1500.',
  'Show me eco-friendly products for my home.',
  'I need a sustainable gift under ₹1000.',
  'Which products have a high Eco Score?',
  'I want plastic-free personal care products.',
];

const GreenGuidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hello! I'm GreenGuide AI, your personal sustainable shopping assistant. Tell me what you are looking for, your budget, or your eco preferences, and I'll find matching products directly from our verified GreenBasket catalog! 🌱",
      recommendations: [],
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle initial query passed via location state or URL query
  useEffect(() => {
    const stateMessage = location.state?.initialMessage;
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get('query');

    const initialMsg = stateMessage || queryParam;
    if (initialMsg && typeof initialMsg === 'string' && initialMsg.trim()) {
      handleSendMessage(initialMsg.trim());
    }
  }, [location]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || loading) return;

    // Reset input if sent via form
    setInputMessage('');
    setError(null);

    // Append user message
    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const res = await askGreenGuideApi(queryText);

      if (res?.success && res?.data) {
        const aiMsgObj = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.data.message || 'Here are a few sustainable options that match your needs 🌱',
          recommendations: res.data.recommendations || [],
          products: res.data.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsgObj]);
      } else {
        throw new Error(res?.message || 'GreenGuide is temporarily unavailable. Please try again.');
      }
    } catch (err) {
      console.error('GreenGuide API Error:', err);
      const errorMsgObj = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'GreenGuide is temporarily unavailable. Please try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2E7D32] to-[#1B4332] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-[#8BC34A] flex items-center justify-center mx-auto shadow-inner border border-white/20">
          <Sparkles className="w-7 h-7" />
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Meet GreenGuide AI 🌱
        </h1>
        <p className="text-xs sm:text-base text-emerald-100 max-w-xl mx-auto font-medium">
          Your personal sustainable shopping assistant.
        </p>

        <div className="pt-2 flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-200 border border-white/10">
            <Leaf className="w-3.5 h-3.5 text-[#8BC34A]" /> Grounded in 100% Real GreenBasket MongoDB Products
          </span>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#1F2937] flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#2E7D32]" /> Popular Sustainable Requests:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(query)}
              disabled={loading}
              className="text-xs bg-white hover:bg-[#E8F5E9] hover:border-[#2E7D32] text-gray-700 hover:text-[#2E7D32] px-3 py-1.5 rounded-full border border-gray-200 transition-all font-medium shadow-xs disabled:opacity-50 text-left"
            >
              🌱 {query}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#F8FAF8]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2E7D32]'
                    : 'bg-[#1B4332] border border-[#8BC34A]/40'
                }`}
              >
                {msg.sender === 'user' ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#8BC34A]" />
                )}
              </div>

              {/* Message Bubble & Products */}
              <div className={`space-y-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                
                {/* Text Bubble */}
                <div
                  className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs max-w-lg ${
                    msg.sender === 'user'
                      ? 'bg-[#2E7D32] text-white rounded-tr-none font-medium'
                      : msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
                      : 'bg-white text-[#1F2937] border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Grounded Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1B4332] uppercase tracking-wider bg-[#E8F5E9] px-2.5 py-1 rounded-md">
                        Recommended Catalog Items ({msg.products.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {msg.products.map((product) => {
                        const recReason = msg.recommendations?.find(
                          (r) => r.productId === product._id || r.productId === product.id
                        )?.reason;

                        return (
                          <div key={product._id} className="flex flex-col space-y-1.5">
                            {recReason && (
                              <div className="bg-[#E8F5E9] p-2 rounded-xl text-[11px] font-medium text-[#2E7D32] border border-[#2E7D32]/20">
                                💡 {recReason}
                              </div>
                            )}
                            <ProductCard product={product} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-md mr-auto animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-[#1B4332] text-[#8BC34A] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 text-xs text-[#2E7D32] font-semibold flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>GreenGuide is finding sustainable options... 🌱</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask GreenGuide (e.g. Reusable kitchen products under ₹1500)..."
              disabled={loading}
              maxLength={500}
              className="flex-1 bg-[#F8FAF8] border border-gray-200 rounded-full px-5 py-3 text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="w-11 h-11 bg-[#2E7D32] hover:bg-[#1B4332] text-white rounded-full flex items-center justify-center transition-all shadow-md disabled:opacity-40 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-2">
            GreenGuide AI recommends items exclusively from the real GreenBasket MongoDB inventory.
          </p>
        </div>

      </div>

    </div>
  );
};

export default GreenGuidePage;
