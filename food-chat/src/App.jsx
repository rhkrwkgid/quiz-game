import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Utensils,
  Loader2,
  Award,
  CheckCircle2,
  MapPin,
  Tag,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCcw,
  Search
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

// 2026 국세청 인증 모범납세자 맛집 데이터 (Source of Truth)
const EXEMPLARY_RESTAURANTS = [
  { "가게명": "부원면옥", "지역": "서울 중구", "음식": "냉면", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "참복집", "지역": "서울 마포구", "음식": "복어 요리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "베이커리나무", "지역": "서울 마포구", "음식": "베이커리, 디저트", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "샘터마루", "지역": "서울 강북구", "음식": "육개장", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "명준목", "지역": "서울 종로구", "음식": "한식(설렁탕/곰탕)", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "풍미연 큰집 설렁탕", "지역": "서울 노원구", "음식": "설렁탕", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "대복집", "지역": "서울 종로구", "음식": "복어 요리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "명원 숯불갈비", "지역": "서울 종로구", "음식": "숯불갈비", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "명가떡집", "지역": "서울 송파구", "음식": "떡, 디저트", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "광어포차", "지역": "서울 강서구", "음식": "해산물, 회", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "더덕향기/김명자굴국밥", "지역": "서울 영등포구", "음식": "굴국밥, 한식", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "동흥관", "지역": "서울 금천구", "음식": "중식", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "탕맨그루브조인트", "지역": "서울 용산구", "음식": "스테이크, 육류", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "커피나인", "지역": "서울 동대문구", "음식": "카페, 커피", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "백년화편", "지역": "서울 강동구", "음식": "떡, 디저트", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "송도갈매기 본점", "지역": "인천", "음식": "갈매기살, 고기", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "고복수 평양냉면", "지역": "평택", "음식": "냉면", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "청담 추어정", "지역": "성남", "음식": "추어탕", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "진미통닭", "지역": "수원", "음식": "치킨, 통닭", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "태봉산한터 오리골", "지역": "용인", "음식": "오리 요리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "기와집 순두부", "지역": "남양주시", "음식": "순두부, 한식", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "만석닭강정 엑스포점", "지역": "속초", "음식": "닭강정", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "청초수물회", "지역": "속초", "음식": "물회", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "참맛 생대구 경산점", "지역": "경산", "음식": "대구탕, 생선 요리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "부용", "지역": "경주", "음식": "중식", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "굿커피베데스다", "지역": "광주", "음식": "카페", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "태극당", "지역": "밀양", "음식": "베이커리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "외양간구시정육", "지역": "거창", "음식": "정육식당, 고기", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "궁전제과", "지역": "광주", "음식": "베이커리", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "명란횟집", "지역": "목포", "음식": "횟집, 해산물", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "우진해장국", "지역": "제주", "음식": "고사리육개장, 몸국", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "그라소", "지역": "광양", "음식": "카페, 디저트", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "함흥집", "지역": "창원", "음식": "한식", "특징": "2026 국세청 인증 모범납세자 맛집" },
  { "가게명": "라봄봄제과점", "지역": "대구", "음식": "베이커리", "특징": "2026 국세청 인증 모범납세자 맛집" }
];

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '반갑습니다! **2026 국세청 인증 모범납세자 맛집** 안내 챗봇입니다. \n\n신뢰할 수 있는 식당들만 엄선하여 알려드립니다. 지역이나 메뉴를 말씀해 주세요! 🎖️',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Exponential backoff fetch
  const fetchGemini = async (userQuery) => {
    const systemPrompt = `
      당신은 '2026 국세청 인증 모범납세자 맛집' 전용 AI 비서입니다.

      [데이터 가이드라인]
      1. 반드시 아래 [맛집 데이터 리스트]에 명시된 식당만 추천하십시오.
      2. 리스트에 없는 식당 정보를 절대 생성하거나 검색하지 마십시오.
      3. 리스트에 없는 정보를 요청받으면 "죄송합니다. 현재 모범납세자 인증 데이터에 해당 정보는 등록되어 있지 않습니다."라고 답하십시오.
      4. 사용자의 상황(데이트, 가족 식사 등)에 맞게 리스트 내 식당을 큐레이션하여 답변하십시오.

      [맛집 데이터 리스트]
      ${JSON.stringify(EXEMPLARY_RESTAURANTS)}

      [답변 형식]
      - 각 식당 이름 앞에는 ✨ 이모지를 사용하십시오.
      - 지역과 대표 메뉴를 강조하십시오.
    `;

    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) throw new Error('API failed');

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        retries++;
        if (retries === maxRetries) return "서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
      }
    }
  };

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await fetchGemini(text);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '대화가 초기화되었습니다. 다시 무엇을 도와드릴까요?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* App Bar */}
      <header className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Award size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight">Gourmet Guide 2026</h1>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter flex items-center gap-1">
              <CheckCircle2 size={10} /> Certified Taxpayer List
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="대화 초기화"
        >
          <RefreshCcw size={20} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="max-w-2xl mx-auto space-y-6 pt-2 pb-10">
          {/* Welcome Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles size={18} className="fill-indigo-100" />
              <h2 className="font-bold text-sm">AI 큐레이터 가이드</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              국세청이 인증한 전국 34개의 모범납세자 식당 데이터를 기반으로 합니다. 정직하고 맛있는 식당을 지금 바로 탐색해 보세요!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 mb-1">DATA COUNT</p>
                <p className="text-lg font-black text-slate-800">{EXEMPLARY_RESTAURANTS.length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 mb-1">STATUS</p>
                <p className="text-lg font-black text-emerald-500 tracking-tighter italic">VERIFIED</p>
              </div>
            </div>
          </div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-200">
                    <Utensils size={16} />
                  </div>
                )}
                <div className="space-y-1">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                  <p className={`text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center animate-pulse text-slate-300">
                 <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="h-4 w-20 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Section */}
      <footer className="bg-white border-t p-4 md:p-6 pb-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Quick Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["냉면", "한식", "카페", "서울 중구", "속초", "광주"].map(tag => (
              <button
                key={tag}
                onClick={() => handleSend(`${tag} 맛집 추천해줘`)}
                className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-transparent hover:border-indigo-200 whitespace-nowrap active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="지역이나 음식을 입력하세요..."
              disabled={isLoading}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-90 disabled:bg-slate-200 shadow-md shadow-indigo-200"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={10} /> Coverage: Nationwide</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1"><Info size={10} /> Source: NTS 2026</span>
          </div>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
