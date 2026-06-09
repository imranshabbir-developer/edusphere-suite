import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftIcon, HandRaisedIcon, MicrophoneIcon, NoSymbolIcon, PaperAirplaneIcon, PhoneXMarkIcon, PresentationChartBarIcon, RecordingIcon, UserGroupIcon, VideoCameraIcon, VideoCameraSlashIcon, SignalIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/app/lms/live")({ component: LiveClass });

const PARTICIPANTS = [
  { name: "Priya Sharma", role: "Teacher" },
  { name: "Aarav Sharma", role: "Student" },
  { name: "Saanvi Patel", role: "Student" },
  { name: "Liam Smith", role: "Student" },
  { name: "Mia Johnson", role: "Student" },
  { name: "Noah Brown", role: "Student" },
  { name: "Sophia Garcia", role: "Student" },
  { name: "Aditya Verma", role: "Student" },
];

function LiveClass() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [recording, setRecording] = useState(true);
  const [hand, setHand] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showPeople, setShowPeople] = useState(false);
  const [messages, setMessages] = useState([
    { from: "Priya Sharma", text: "Welcome to today's class on Neural Networks!" },
    { from: "Aarav Sharma", text: "Excited!" },
    { from: "Saanvi Patel", text: "Are slides shared?" },
    { from: "Priya Sharma", text: "Yes, posted in Materials tab." },
  ]);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "You", text: draft }]);
    setDraft("");
  };

  return (
    <div className="-m-4 lg:-m-6 h-[calc(100vh-4rem)] flex flex-col bg-secondary text-secondary-foreground">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-danger/20 text-danger text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" /> LIVE
          </div>
          <p className="font-semibold">Intro to AI · Lecture 12 — Neural Networks</p>
          <span className="text-xs opacity-60">42:18</span>
        </div>
        <div className="flex items-center gap-2 text-xs opacity-80">
          <SignalIcon className="w-4 h-4" /> Excellent connection
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden relative gradient-hero">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur text-xs">
              <PresentationChartBarIcon className="w-4 h-4" /> Sharing — Slide 8 / 22
            </div>
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur text-xs">Priya Sharma · Teacher</div>
            <div className="absolute bottom-3 right-3 w-40 aspect-video rounded-lg bg-black/60 border border-white/20 flex items-center justify-center text-xs">You</div>
            <div className="h-full flex items-center justify-center text-2xl font-bold tracking-tight opacity-90 px-6 text-center">
              Backpropagation: how neural networks learn from data
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {PARTICIPANTS.slice(0, 6).map((p) => (
              <div key={p.name} className="aspect-video rounded-lg bg-black/40 border border-white/10 flex flex-col items-center justify-center text-xs">
                <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center font-semibold mb-1">{p.name[0]}</div>
                {p.name.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>

        {(showChat || showPeople) && (
          <motion.aside initial={{ x: 320 }} animate={{ x: 0 }}
            className="w-80 border-l border-white/10 flex flex-col bg-secondary">
            <div className="flex border-b border-white/10">
              <button onClick={() => { setShowChat(true); setShowPeople(false); }} className={`flex-1 py-2.5 text-sm font-medium ${showChat ? "border-b-2 border-primary text-primary-foreground" : "opacity-60"}`}>Chat</button>
              <button onClick={() => { setShowPeople(true); setShowChat(false); }} className={`flex-1 py-2.5 text-sm font-medium ${showPeople ? "border-b-2 border-primary text-primary-foreground" : "opacity-60"}`}>People ({PARTICIPANTS.length})</button>
            </div>
            {showChat ? (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                  {messages.map((m, i) => (
                    <div key={i}>
                      <p className="text-xs opacity-60">{m.from}</p>
                      <p className="text-sm bg-white/10 rounded-lg p-2 inline-block">{m.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-white/10 flex gap-1">
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Message…" className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm outline-none focus:bg-white/15" />
                  <button onClick={send} className="p-2 rounded-lg gradient-primary"><PaperAirplaneIcon className="w-4 h-4" /></button>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {PARTICIPANTS.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-xs font-semibold">{p.name[0]}</div>
                    <div className="flex-1 text-sm">
                      <p>{p.name}</p>
                      <p className="text-xs opacity-60">{p.role}</p>
                    </div>
                    <MicrophoneIcon className="w-4 h-4 opacity-60" />
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        )}
      </div>

      <div className="p-3 border-t border-white/10 flex items-center justify-center gap-2">
        <ToolBtn active={mic} onClick={() => setMic(!mic)} on={<MicrophoneIcon className="w-5 h-5" />} off={<NoSymbolIcon className="w-5 h-5" />} label="Mic" />
        <ToolBtn active={cam} onClick={() => setCam(!cam)} on={<VideoCameraIcon className="w-5 h-5" />} off={<VideoCameraSlashIcon className="w-5 h-5" />} label="Camera" />
        <ToolBtn active={hand} onClick={() => setHand(!hand)} on={<HandRaisedIcon className="w-5 h-5" />} off={<HandRaisedIcon className="w-5 h-5" />} label="Raise hand" />
        <ToolBtn active={recording} onClick={() => setRecording(!recording)} on={<RecordingIcon className="w-5 h-5" />} off={<RecordingIcon className="w-5 h-5" />} label="Record" danger={recording} />
        <ToolBtn active={false} onClick={() => alert("Sharing screen…")} on={<PresentationChartBarIcon className="w-5 h-5" />} off={<PresentationChartBarIcon className="w-5 h-5" />} label="Share" />
        <ToolBtn active={showPeople} onClick={() => { setShowPeople(!showPeople); setShowChat(false); }} on={<UserGroupIcon className="w-5 h-5" />} off={<UserGroupIcon className="w-5 h-5" />} label="People" />
        <ToolBtn active={showChat} onClick={() => { setShowChat(!showChat); setShowPeople(false); }} on={<ChatBubbleLeftIcon className="w-5 h-5" />} off={<ChatBubbleLeftIcon className="w-5 h-5" />} label="Chat" />
        <button className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger text-danger-foreground font-semibold text-sm">
          <PhoneXMarkIcon className="w-5 h-5" /> Leave
        </button>
      </div>
    </div>
  );
}

function ToolBtn({ active, onClick, on, off, label, danger }: { active: boolean; onClick: () => void; on: React.ReactNode; off: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button onClick={onClick} title={label}
      className={`p-3 rounded-xl transition ${active ? (danger ? "bg-danger text-danger-foreground" : "bg-primary text-primary-foreground") : "bg-white/10 hover:bg-white/15"}`}>
      {active ? on : off}
    </button>
  );
}
