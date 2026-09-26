import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowUp, BookOpen, Brain, Check, ChevronDown, Clock3, FileText, FolderOpen,
  GraduationCap, Headphones, Home, ImagePlus, LayoutDashboard, Library, Menu,
  MessageCircle, MoreHorizontal, Paperclip, PenLine, Play, Plus, Search, Send,
  Settings, Sparkles, Star, Target, Upload, UserRound, X, Zap,
} from 'lucide-react'
import './styles.css'

const initialMessages = [
  { role: 'assistant', text: 'Hey Alex, good to see you. What are we learning today?', time: '9:41 AM' },
  { role: 'user', text: 'I have a biology exam on Friday. Can you help me make a study plan?', time: '9:42 AM' },
  { role: 'assistant', text: 'Absolutely. We have four days, so let\'s make them count without cramming. I\'ll build a focused plan around your topics and energy.', time: '9:42 AM' },
]

const navItems = [
  { label: 'Workspace', icon: LayoutDashboard },
  { label: 'My library', icon: Library },
  { label: 'Study plans', icon: Target },
]

const suggestions = [
  { icon: FileText, label: 'Summarize a PDF', tone: 'lavender' },
  { icon: Brain, label: 'Create a quiz', tone: 'peach' },
  { icon: PenLine, label: 'Explain a concept', tone: 'mint' },
  { icon: Headphones, label: 'Start focus mode', tone: 'yellow' },
]

function App() {
  const [activeNav, setActiveNav] = useState('Workspace')
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [showPricing, setShowPricing] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function sendMessage(event) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { role: 'user', text: trimmed, time: 'Now' }])
    setInput('')
    window.setTimeout(() => {
      setMessages((current) => [...current, {
        role: 'assistant',
        text: 'I\'m on it. I\'ll turn that into a clear next step you can actually use.',
        time: 'Now',
      }])
    }, 650)
  }

  function chooseSuggestion(label) {
    if (label === 'Start focus mode') {
      notify('Focus mode is ready when you are.')
      return
    }
    setInput(label === 'Explain a concept' ? 'Explain photosynthesis in a simple way' : `${label} for my biology notes`)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></div>
          <span>studybuddy<span className="brand-dot">.</span></span>
          <button className="icon-button close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <button className="new-chat" onClick={() => { setMessages(initialMessages); setActiveNav('Workspace'); notify('New study session started') }}><Plus size={17} /> New study session</button>
        <div className="nav-section-label">Your space</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveNav(label); setMobileNav(false) }}><Icon size={17} /><span>{label}</span>{label === 'My library' && <span className="nav-count">12</span>}</button>
          ))}
        </nav>
        <div className="nav-section-label recent-label">Recent chats</div>
        <div className="recent-chats">
          <button className="recent-chat active-chat"><MessageCircle size={15} /><span>Biology exam plan</span><MoreHorizontal size={15} /></button>
          <button className="recent-chat"><MessageCircle size={15} /><span>Essay feedback · Sociology</span></button>
          <button className="recent-chat"><MessageCircle size={15} /><span>Calculus practice set</span></button>
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Zap size={15} fill="currentColor" /></div>
            <div><strong>Unlock your flow</strong><p>Get unlimited study tools</p></div>
            <button onClick={() => setShowPricing(true)} aria-label="View plans"><ArrowUp size={15} /></button>
          </div>
          <button className="profile-row" onClick={() => notify('Profile settings are coming soon')}><span className="avatar small-avatar">AM</span><span><strong>Alex Morgan</strong><small>Free plan</small></span><MoreHorizontal size={16} /></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>{activeNav}</span><span className="crumb-slash">/</span><strong>Biology exam plan</strong></div>
          <div className="topbar-actions"><button className="icon-button" onClick={() => notify('Search is ready')} aria-label="Search"><Search size={19} /></button><button className="icon-button" onClick={() => notify('Settings are coming soon')} aria-label="Settings"><Settings size={19} /></button><button className="top-avatar">AM</button></div>
        </header>

        <section className="workspace">
          <div className="welcome-row">
            <div><div className="eyebrow"><span className="live-dot" /> Tuesday, September 23</div><h1>Good morning, Alex.</h1><p>Let&apos;s make a little progress today.</p></div>
            <button className="streak-pill" onClick={() => notify('Three day streak. Keep it going!')}><span className="streak-flame">✦</span><span><strong>3 day streak</strong><small>Keep it going</small></span><ChevronDown size={15} /></button>
          </div>

          <div className="dashboard-grid">
            <section className="chat-panel panel">
              <div className="panel-header"><div className="panel-title"><div className="ai-icon"><Sparkles size={15} /></div><div><strong>StudyBuddy AI</strong><span><span className="online-dot" /> Online</span></div></div><button className="icon-button" onClick={() => notify('More options')} aria-label="More options"><MoreHorizontal size={19} /></button></div>
              <div className="messages">
                {messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.time}-${index}`}><div className={message.role === 'assistant' ? 'message-avatar ai-avatar' : 'message-avatar user-avatar'}>{message.role === 'assistant' ? <Sparkles size={14} /> : 'AM'}</div><div className="message-content"><div className="message-bubble">{message.text}</div><span className="message-time">{message.time}</span></div></div>)}
                <div className="typing-hint"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
              </div>
              <form className="composer" onSubmit={sendMessage}><button type="button" className="attach-button" onClick={() => notify('File picker is ready')} aria-label="Attach file"><Paperclip size={18} /></button><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything about your studies..." aria-label="Message StudyBuddy" /><button type="button" className="voice-button" onClick={() => notify('Voice mode is coming soon')} aria-label="Voice input"><Headphones size={17} /></button><button className="send-button" type="submit" aria-label="Send message"><ArrowUp size={18} /></button></form>
              <div className="composer-footer"><span><Sparkles size={12} /> StudyBuddy can make mistakes. Check important info.</span><span>⌘ + Enter to send</span></div>
            </section>

            <aside className="right-column">
              <section className="quick-tools panel"><div className="panel-heading"><div><span className="section-kicker">Make progress</span><h2>Quick tools</h2></div><button className="text-button" onClick={() => notify('All tools are in your library')}>View all <ArrowUp size={14} /></button></div><div className="tool-list">{suggestions.map(({ icon: Icon, label, tone }) => <button className="tool-item" key={label} onClick={() => chooseSuggestion(label)}><span className={`tool-icon ${tone}`}><Icon size={18} /></span><span>{label}</span><ArrowUp size={15} className="tool-arrow" /></button>)}</div></section>
              <section className="progress-card"><div className="progress-copy"><span className="section-kicker">This week</span><h2>Your progress</h2><p>Small steps add up.</p></div><div className="progress-ring"><svg viewBox="0 0 42 42"><circle className="ring-track" cx="21" cy="21" r="15.9" /><circle className="ring-value" cx="21" cy="21" r="15.9" /></svg><strong>68<span>%</span></strong></div><div className="progress-stats"><div><strong>4.5h</strong><span>Study time</span></div><div><strong>12</strong><span>Sessions</span></div><div><strong>86%</strong><span>Focus score</span></div></div></section>
            </aside>
          </div>

          <section className="bottom-section"><div className="section-heading"><div><span className="section-kicker">Keep learning</span><h2>Pick up where you left off</h2></div><button className="icon-button" onClick={() => notify('More sessions loaded')} aria-label="More sessions"><MoreHorizontal size={19} /></button></div><div className="session-grid"><button className="session-card featured" onClick={() => setActiveNav('Workspace')}><div className="session-card-top"><span className="subject-tag blue-tag">BIOLOGY</span><span>Today, 9:42 AM</span></div><h3>Biology exam plan</h3><p>Build a realistic study plan for your exam this Friday.</p><div className="session-card-bottom"><span className="mini-avatar"><Sparkles size={12} /></span><span>StudyBuddy AI</span><ArrowUp size={15} /></div></button><button className="session-card" onClick={() => notify('Opening Sociology essay feedback')}><div className="session-card-top"><span className="subject-tag coral-tag">SOCIOLOGY</span><span>Yesterday</span></div><h3>Essay feedback</h3><p>Strengthen my argument and make the conclusion sharper.</p><div className="session-card-bottom"><span className="mini-avatar peach-avatar"><PenLine size={12} /></span><span>StudyBuddy AI</span><ArrowUp size={15} /></div></button><button className="session-card" onClick={() => notify('Opening Calculus practice set')}><div className="session-card-top"><span className="subject-tag green-tag">CALCULUS</span><span>Sep 20</span></div><h3>Practice set</h3><p>Walk me through integration by parts, step by step.</p><div className="session-card-bottom"><span className="mini-avatar mint-avatar"><Brain size={12} /></span><span>StudyBuddy AI</span><ArrowUp size={15} /></div></button></div></section>
        </section>
      </main>
      {toast && <div className="toast"><Check size={15} /> {toast}</div>}
      {showPricing && <PricingModal close={() => setShowPricing(false)} />}
    </div>
  )
}

function PricingModal({ close }) {
  return <div className="modal-backdrop" onClick={close}><div className="pricing-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Close pricing"><X size={18} /></button><div className="modal-spark"><Star size={18} fill="currentColor" /></div><span className="section-kicker">Go a little further</span><h2>Study with more room to think.</h2><p>Upgrade to StudyBuddy Plus for deeper answers, unlimited tools, and a calmer way to stay on track.</p><div className="price-row"><div><strong>$6</strong><span>/ month</span></div><span className="price-note">Cancel anytime</span></div><button className="upgrade-button" onClick={close}>Start Plus <ArrowUp size={16} /></button><div className="feature-line"><Check size={14} /> Unlimited AI study sessions <Check size={14} /> File uploads <Check size={14} /> Focus mode</div></div></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
