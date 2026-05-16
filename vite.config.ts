import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from 'qr-code-styling';
import { 
  Link, 
  Image as ImageIcon, 
  Palette, 
  Maximize, 
  Type, 
  Download, 
  Mic, 
  MicOff,
  Settings2,
  Brush,
  Layers,
  Sparkles,
  Save,
  History as HistoryIcon,
  Trash2,
  ExternalLink,
  Upload,
  Loader2
} from 'lucide-react';
import { auth, saveQRCode, subscribeToHistory, QRCodeData, db, uploadImage } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

interface QRCodeGeneratorProps {
  externalColor1: string;
  externalColor2: string;
  externalCornerSquareColor: string;
  externalCornerDotColor: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
  onCornerSquareColorChange: (color: string) => void;
  onCornerDotColorChange: (color: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  'vermelho': '#ef4444',
  'verde': '#22c55e',
  'azul': '#3b82f6',
  'amarelo': '#eab308',
  'branco': '#ffffff',
  'preto': '#000000',
  'roxo': '#a855f7',
  'laranja': '#f97316',
  'rosa': '#ec4899',
};

export function QRCodeGenerator({ 
  externalColor1, 
  externalColor2, 
  externalCornerSquareColor,
  externalCornerDotColor,
  onColor1Change, 
  onColor2Change,
  onCornerSquareColorChange,
  onCornerDotColorChange
}: QRCodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'image'>('link');
  const [url, setUrl] = useState('https://google.com');
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState(300);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot');
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [mode, setMode] = useState<Mode>('Byte');
  const [extension, setExtension] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [imageMargin, setImageMargin] = useState(10);
  const [imageScale, setImageScale] = useState(4); 
  const [hideDots, setHideDots] = useState(true);
  
  // Voice Control State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auth & History State
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<QRCodeData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling({
    width: 300,
    height: 300,
    data: url,
    dotsOptions: {
      color: externalColor1,
      type: 'rounded'
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10
    }
  }));

  const startVoiceControl = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'pt-BR';

    recognitionRef.current.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Comando de voz:', command);

      // Simple command parsing
      if (command.includes('mudar cor principal para')) {
        for (const [name, hex] of Object.entries(COLOR_MAP)) {
          if (command.includes(name)) {
            onColor1Change(hex);
            break;
          }
        }
      } else if (command.includes('mudar cor secundária para')) {
        for (const [name, hex] of Object.entries(COLOR_MAP)) {
          if (command.includes(name)) {
            onColor2Change(hex);
            break;
          }
        }
      } else if (command.includes('baixar')) {
        download();
      } else if (command.includes('mudar link para')) {
        const newUrl = command.replace('mudar link para', '').trim().replace(' ', '');
        setUrl(newUrl.includes('.') ? newUrl : `https://${newUrl}`);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    setIsListening(true);
  }, [onColor1Change, onColor2Change, setUrl]);

  const stopVoiceControl = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (qrRef.current) {
      qrCode.current.append(qrRef.current);
    }
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      stopVoiceControl();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribeHistory = subscribeToHistory(user.uid, (qrs) => {
        setHistory(qrs);
      });
      return () => unsubscribeHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  useEffect(() => {
    qrCode.current.update({
      data: activeTab === 'link' ? url : imageUrl || ' ',
      width: size,
      height: size,
      image: activeTab === 'image' ? imageUrl : '',
      dotsOptions: {
        color: externalColor1,
        type: dotType,
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: externalColor1 },
            { offset: 1, color: externalColor2 }
          ]
        }
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: externalCornerSquareColor,
        type: cornerSquareType,
      },
      cornersDotOptions: {
        color: externalCornerDotColor,
        type: cornerDotType,
      },
      qrOptions: {
        mode: mode
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: imageMargin,
        imageSize: imageScale / 10,
        hideBackgroundDots: hideDots,
      }
    });
  }, [url, imageUrl, size, externalColor1, externalColor2, bgColor, externalCornerSquareColor, externalCornerDotColor, cornerSquareType, cornerDotType, dotType, activeTab, mode, imageMargin, imageScale, hideDots]);

  const download = () => {
    qrCode.current.download({ name: 'qr-code', extension: extension });
  };

  const handleSave = async () => {
    if (!user) {
      alert("Por favor, faça login para salvar.");
      return;
    }

    setIsSaving(true);
    try {
      await saveQRCode({
        url: activeTab === 'link' ? url : imageUrl,
        name: `QR ${new Date().toLocaleDateString()}`,
        userId: user.uid,
        config: {
          color1: externalColor1,
          color2: externalColor2,
          bgColor,
          cornerSquareColor: externalCornerSquareColor,
          cornerDotColor: externalCornerDotColor,
          dotType,
          cornerSquareType,
          cornerDotType
        }
      });
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'qrcodes', id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const applyFromHistory = (item: QRCodeData) => {
    setUrl(item.url);
    onColor1Change(item.config.color1);
    onColor2Change(item.config.color2);
    setBgColor(item.config.bgColor);
    onCornerSquareColorChange(item.config.cornerSquareColor);
    onCornerDotColorChange(item.config.cornerDotColor);
    setDotType(item.config.dotType as DotType);
    setCornerSquareType(item.config.cornerSquareType as CornerSquareType);
    setCornerDotType(item.config.cornerDotType as CornerDotType);
    setActivePanel('content');
  };

  const [activePanel, setActivePanel] = useState<'content' | 'design' | 'advanced' | 'history'>('content');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Navigation Rails */}
      <div className="lg:col-span-1 flex lg:flex-col gap-4">
        {[
          { id: 'content', icon: Link, label: 'Conteúdo' },
          { id: 'design', icon: Brush, label: 'Design' },
          { id: 'advanced', icon: Settings2, label: 'Avançado' },
          { id: 'history', icon: HistoryIcon, label: 'Histórico' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(item.id as any)}
            className={`flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 ${
              activePanel === item.id 
                ? 'bg-premium-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[8px] uppercase tracking-widest mt-2 font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Control Panels */}
      <div className="lg:col-span-6 space-y-6">
        <AnimatePresence mode="wait">
          {activePanel === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass p-8 rounded-3xl space-y-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Origem de Dados</h2>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab('link')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'link' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                  >
                    LINK
                  </button>
                  <button
                    onClick={() => setActiveTab('image')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'image' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                  >
                    IMAGEM
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 transition-colors group-focus-within:text-premium-accent">
                    {activeTab === 'link' ? 'Destino do QR Code' : 'Logotipo Central'}
                  </label>
                  
                  {activeTab === 'link' ? (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Link size={16} />
                      </div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-premium-accent transition-all font-mono text-sm tracking-tight"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                          <ImageIcon size={16} />
                        </div>
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Cole a URL da Imagem..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-premium-accent transition-all font-mono text-sm tracking-tight"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !user) return;
                            setIsUploading(true);
                            try {
                              const downloadUrl = await uploadImage(file, user.uid);
                              setImageUrl(downloadUrl);
                            } catch (err) {
                              console.error("Upload failed", err);
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        />
                        <label
                          htmlFor="logo-upload"
                          className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                            user 
                              ? 'border-white/10 hover:border-premium-accent hover:bg-white/5' 
                              : 'border-white/5 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {isUploading ? (
                            <Loader2 size={18} className="animate-spin text-premium-accent" />
                          ) : (
                            <Upload size={18} className="text-zinc-500" />
                          )}
                          <div className="flex flex-col items-start leading-tight">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white">
                              {user ? 'Upload Manual' : 'Login necessário para Upload'}
                            </span>
                            <span className="text-[8px] uppercase text-zinc-600">JPG, PNG, SVG • MÁX 2MB</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Controle por Voz</span>
                    <span className="text-[9px] text-zinc-600 mt-0.5 whitespace-pre">Ex: "Mudar cor principal para azul"</span>
                  </div>
                  <button
                    onClick={isListening ? stopVoiceControl : startVoiceControl}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isListening ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass p-8 rounded-3xl space-y-8"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Estética & Cores</h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500">Cores de Gradiente</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={externalColor1}
                      onChange={(e) => onColor1Change(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0"
                    />
                    <input
                      type="color"
                      value={externalColor2}
                      onChange={(e) => onColor2Change(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0"
                    />
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white font-mono uppercase tracking-tighter">{externalColor1}</span>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">{externalColor2}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500">Fundo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0"
                    />
                    <span className="text-[10px] text-white font-mono uppercase tracking-tighter">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3 text-center">Formato dos Pontos</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['square', 'dots', 'rounded', 'extra-rounded'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setDotType(t as any)}
                          className={`py-2 text-[9px] uppercase font-bold rounded-lg border transition-all ${dotType === t ? 'bg-premium-accent/20 border-premium-accent text-white' : 'border-white/5 text-zinc-500 hover:border-white/20'}`}
                        >
                          {t.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3 text-center">Cantos Supremos</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['square', 'dot', 'extra-rounded', 'classy'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setCornerSquareType(t as any)}
                          className={`py-2 text-[9px] uppercase font-bold rounded-lg border transition-all ${cornerSquareType === t ? 'bg-premium-accent/20 border-premium-accent text-white' : 'border-white/5 text-zinc-500 hover:border-white/20'}`}
                        >
                          {t.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass p-8 rounded-3xl space-y-8"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Parâmetros Técnicos</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Resolução de Saída</label>
                    <span className="text-xs font-mono text-premium-accent">{size}px</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-premium-accent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Código</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as Mode)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none accent-premium-accent"
                    >
                      <option value="Numeric">Numérica</option>
                      <option value="Alphanumeric">Alfanumérica</option>
                      <option value="Byte">Byte</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Formato</label>
                    <select
                      value={extension}
                      onChange={(e) => setExtension(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none accent-premium-accent uppercase"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="svg">SVG</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass p-8 rounded-3xl space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Histórico de Criação</h2>
              
              {!user ? (
                <div className="text-center py-12">
                  <HistoryIcon size={40} className="mx-auto text-zinc-700 mb-4" />
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Faça login para ver seu histórico</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles size={40} className="mx-auto text-zinc-700 mb-4" />
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Nenhum QR Code salvo ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="group glass p-4 rounded-2xl flex items-center justify-between hover:border-premium-accent/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                           <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(item.url)}&color=${item.config.color1.replace('#', '')}&bgcolor=${item.config.bgColor.replace('#', '')}`} 
                            alt="preview" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                           />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold truncate max-w-[150px]">{item.name}</span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-[150px] font-mono">{item.url}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => applyFromHistory(item)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-premium-accent hover:bg-white/10 transition-all"
                          title="Carregar Configurações"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button 
                          onClick={() => item.id && handleDeleteHistory(item.id)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white/10 transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group w-full max-w-md"
        >
          {/* Subtle 3D background shadow effect */}
          <div className="absolute inset-0 bg-premium-accent/20 rounded-[40px] blur-[40px] -z-10 transition-all duration-700 group-hover:scale-110 group-hover:bg-premium-accent/30" />
          
          <div className="neo-shadow p-1 bg-white/10 rounded-[40px] border border-white/10 overflow-hidden">
            <div className="bg-white p-6 sm:p-8 rounded-[36px] flex items-center justify-center transition-transform duration-700 hover:scale-[1.02]">
              <div ref={qrRef} className="w-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto" />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
             <div className="flex gap-3">
                <button
                  onClick={download}
                  className="flex-1 bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-premium-accent hover:text-white transition-all duration-500 active:scale-95 shadow-xl"
                >
                  <Download size={18} />
                  <span className="text-xs uppercase tracking-widest">Processar & Salvar</span>
                </button>
                <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Sparkles size={20} />
                </button>
             </div>
             
             {user && (
               <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Adicionar ao Histórico</span>
               </button>
             )}
          </div>

          <p className="mt-6 text-[9px] text-zinc-600 text-center uppercase tracking-[0.3em] font-medium">
            Verificado • Encriptado • Pronto para Uso
          </p>
        </motion.div>
      </div>
    </div>
  );
}
