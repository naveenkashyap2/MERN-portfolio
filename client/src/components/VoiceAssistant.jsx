import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Languages, X, Volume2, Sparkles } from "lucide-react";
import { Button } from "./UI";

const LANGUAGES = [
  { code: "hi-IN", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "en-IN", label: "English", native: "English", flag: "🇬🇧" },
  { code: "mr-IN", label: "Marathi", native: "मराठी", flag: "🌸" },
  { code: "kn-IN", label: "Kannada", native: "ಕನ್ನಡ", flag: "☘️" },
];

const RESPONSES = {
  "hi-IN": {
    greet: "नमस्ते! मैं YatraGenie हूँ। बोलिए, कहाँ जाना है?",
    help: "मैं आपकी यात्रा प्लान कर सकता हूँ। बस बोलिए - जैसे 'कानपुर से दिल्ली 2 दिन का प्लान बना दो'",
    done: "समझ गया! आपका प्लान बना रहा हूँ।",
  },
  "en-IN": {
    greet: "Hello! I'm YatraGenie. Tell me, where do you want to go?",
    help: "I can plan your trip. Just say - e.g. 'Plan 2 days Kanpur to Delhi in 8000'",
    done: "Got it! Creating your plan.",
  },
  "mr-IN": {
    greet: "नमस्कार! मी YatraGenie आहे. बोला, कुठे जायचं आहे?",
    help: "मी तुमची यात्रा नियोजित करू शकतो. बोला - 'कानपूर ते दिल्ली 2 दिवस'",
    done: "समजलं! तुमचा प्लान बनवत आहे.",
  },
  "kn-IN": {
    greet: "ನಮಸ್ಕಾರ! ನಾನು YatraGenie. ಹೇಳಿ, ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?",
    help: "ನಾನು ನಿಮ್ಮ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಬಲ್ಲೆ. ಹೇಳಿ - 'ಕಾನ್ಪುರದಿಂದ ದೆಹಲಿಗೆ 2 ದಿನ'",
    done: "ಅರ್ಥವಾಯಿತು! ನಿಮ್ಮ ಯೋಜನೆ ಮಾಡುತ್ತಿದ್ದೇನೆ.",
  }
};

export default function VoiceAssistant({ onAction }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setReply("Voice not supported in this browser. Chrome me try karo."); return; }
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => { setListening(true); setTranscript(""); setReply(""); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text);
    };
    rec.onerror = (e) => { setListening(false); setReply("Error: " + e.error); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    if (!transcript) speak(RESPONSES[lang].greet);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
    window.speechSynthesis.cancel();
  };

  const handleCommand = (text) => {
    const lower = text.toLowerCase();
    let r = "";
    if (lower.includes("kanpur") && lower.includes("delhi")) {
      r = lang==="hi-IN" ? "कानपुर से दिल्ली के लिए बढ़िया! Highway NH19 440km, Shram Shakti 23:55 वाली ट्रेन सबसे अच्छी है। क्या मैं 2 दिन का प्लान बना दूँ?" :
          lang==="en-IN" ? "Kanpur to Delhi — great! NH19 440km by road, Shram Shakti 23:55 train is best. Shall I create 2-day plan?" :
          `Found Kanpur → Delhi intent for ${lang}`;
      speak(r);
      setReply(r);
      if (onAction) onAction({ type: "trip", source: "Kanpur", destination: "Delhi", text });
    } else if (lower.includes("create") || lower.includes("plan") || lower.includes("बना") || lower.includes("करा") || lower.includes("ಮಾಡು")) {
      r = RESPONSES[lang].done;
      speak(r); setReply(r);
      if (onAction) onAction({ type: "create", text });
    } else if (lower.includes("live") || lower.includes("tracker") || lower.includes("location")) {
      r = lang==="hi-IN" ? "लाइव ट्रैकर खोल रहा हूँ — हर कदम track होगा!" : "Opening live tracker — every step will be tracked!";
      speak(r); setReply(r);
      if (onAction) onAction({ type: "live" });
    } else {
      r = lang==="hi-IN" ? `आपने कहा: "${text}" — मैं इसे समझ रहा हूँ। "Kanpur to Delhi plan" बोलकर देखिए!` : `You said: "${text}" — Try saying "Kanpur to Delhi plan"`;
      speak(r); setReply(r);
    }
  };

  return (
    <>
      <button onClick={()=>setOpen(!open)} className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition ${open ? "bg-charcoal" : "bg-gradient-to-br from-violet-600 to-primary-600 hover:scale-105"}`}>
        {open ? <X size={20}/> : <Mic size={22}/>}
        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] bg-white rounded-[20px] shadow-2xl border overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-primary-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><Sparkles size={16}/> YatraGenie Voice</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><Languages size={12}/> 4 Languages</span>
            </div>
            <div className="flex gap-2 mt-3">
              {LANGUAGES.map(l=>(
                <button key={l.code} onClick={()=>setLang(l.code)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${lang===l.code ? "bg-white text-violet-700 border-white" : "bg-white/10 border-white/20 text-white"}`}>{l.flag} {l.native}</button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {!supported && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">Voice Chrome/Edge me best chalta hai. Safari me limited.</p>}
            
            <div className="bg-gray-50 rounded-2xl p-3 min-h-[80px]">
              {!transcript && !reply ? (
                <p className="text-sm text-muted">{RESPONSES[lang].help}</p>
              ) : (
                <>
                  {transcript && <p className="text-sm"><b className="text-primary-600">You:</b> {transcript}</p>}
                  {reply && <p className="text-sm mt-2 bg-white border rounded-xl p-2"><b className="text-violet-600 flex items-center gap-1"><Volume2 size={12}/> Genie:</b> {reply}</p>}
                </>
              )}
            </div>

            <div className="flex gap-2">
              {!listening ? (
                <Button onClick={startListening} className="flex-1"><Mic size={16}/> बोलो — Tap to Speak</Button>
              ) : (
                <Button onClick={stopListening} variant="secondary" className="flex-1 border-red-200 bg-red-50 text-red-600"><MicOff size={16}/> सुन रहा हूँ... Tap to Stop <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></span></Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button onClick={()=>{setTranscript("Kanpur se Delhi 2 din ka plan"); handleCommand("Kanpur se Delhi 2 din ka plan");}} className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200">“Kanpur → Delhi”</button>
              <button onClick={()=>handleCommand("Live tracker kholo")} className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200">“Live tracker”</button>
              <button onClick={()=>handleCommand("History dikhao")} className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200">“History?”</button>
            </div>

            <p className="text-[11px] text-muted text-center">Hindi • English • मराठी • ಕನ್ನಡ — Auto speak & listen • 100% Free</p>
          </div>
        </div>
      )}
    </>
  );
}
