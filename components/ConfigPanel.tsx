import React, { useState } from 'react';
import { AppConfig, AIProvider } from '../types';
import { testConnection, SecureStorage } from '../utils';
import Toastify from 'toastify-js';

interface ConfigPanelProps {
  onSave: (config: AppConfig) => void;
  initialConfig: AppConfig;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onSave, initialConfig }) => {
  const [config, setConfig] = useState<AppConfig>({
      ...initialConfig,
      amazonAccessKey: SecureStorage.decrypt(initialConfig.amazonAccessKey || ''),
      amazonSecretKey: SecureStorage.decrypt(initialConfig.amazonSecretKey || ''),
      geminiApiKey: SecureStorage.decrypt(initialConfig.geminiApiKey || ''),
      openaiApiKey: SecureStorage.decrypt(initialConfig.openaiApiKey || ''),
      anthropicApiKey: SecureStorage.decrypt(initialConfig.anthropicApiKey || ''),
      groqApiKey: SecureStorage.decrypt(initialConfig.groqApiKey || ''),
      openrouterApiKey: SecureStorage.decrypt(initialConfig.openrouterApiKey || ''),
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wp' | 'amazon' | 'ai' | 'sota'>('wp');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...config,
        amazonAccessKey: SecureStorage.encrypt(config.amazonAccessKey),
        amazonSecretKey: SecureStorage.encrypt(config.amazonSecretKey),
        geminiApiKey: SecureStorage.encrypt(config.geminiApiKey || ''),
        openaiApiKey: SecureStorage.encrypt(config.openaiApiKey || ''),
        anthropicApiKey: SecureStorage.encrypt(config.anthropicApiKey || ''),
        groqApiKey: SecureStorage.encrypt(config.groqApiKey || ''),
        openrouterApiKey: SecureStorage.encrypt(config.openrouterApiKey || ''),
    });
    setIsOpen(false);
  };

  const handleTestConnection = async () => {
      setTestStatus('testing');
      const result = await testConnection(config);
      if (result.success) {
          setTestStatus('success');
          Toastify({ text: "Connected to WordPress!", backgroundColor: "#10b981" }).showToast();
      } else {
          setTestStatus('error');
          Toastify({ text: result.message, duration: 4000, backgroundColor: "#ef4444" }).showToast();
      }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed top-4 left-4 z-50 bg-dark-900/50 backdrop-blur p-4 rounded-2xl text-brand-400 border border-dark-700 hover:scale-110 transition-transform shadow-2xl">
         <i className="fa-solid fa-gear text-xl"></i>
      </button>

      {isOpen && (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-dark-900 border border-dark-800 w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          
          <div className="flex justify-between items-center p-8 border-b border-dark-800">
            <h2 className="text-3xl font-black text-white tracking-tighter">System Configuration</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><i className="fa-solid fa-times text-xl"></i></button>
          </div>

          <div className="flex border-b border-dark-800 bg-dark-950/50">
             {['wp', 'amazon', 'ai', 'sota'].map(t => (
                 <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500'}`}>
                     {t === 'wp' ? 'WordPress' : t === 'amazon' ? 'Amazon' : t === 'ai' ? 'Brain Core' : 'SOTA Flags'}
                 </button>
             ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
            
            {activeTab === 'wp' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Site URL</label>
                        <input type="url" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none transition-colors" placeholder="https://mysite.com" value={config.wpUrl} onChange={e => setConfig({...config, wpUrl: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Username" value={config.wpUser} onChange={e => setConfig({...config, wpUser: e.target.value})} required />
                        <input type="password" className="bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="App Password" value={config.wpAppPassword} onChange={e => setConfig({...config, wpAppPassword: e.target.value})} required />
                    </div>
                    <button type="button" onClick={handleTestConnection} className="w-full bg-dark-800 py-3 rounded-xl text-xs font-bold text-gray-400 border border-dark-700 hover:bg-dark-700 transition-colors">
                        {testStatus === 'testing' ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : null}
                        Test WP API Link
                    </button>
                </div>
            )}

            {activeTab === 'amazon' && (
                <div className="space-y-4 animate-fade-in">
                    <input type="text" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Associate Tag (e.g. tag-20)" value={config.amazonTag} onChange={e => setConfig({...config, amazonTag: e.target.value})} required />
                    <input type="text" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="SerpApi Key (Required for Product Lookup)" value={config.serpApiKey || ''} onChange={e => setConfig({...config, serpApiKey: e.target.value})} />
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <p className="text-xs text-amber-400">
                        <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                        SerpApi key is required for accurate product images and data. Get one at <a href="https://serpapi.com" target="_blank" rel="noopener" className="underline">serpapi.com</a>
                      </p>
                    </div>
                </div>
            )}

            {activeTab === 'ai' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">AI Provider</label>
                        <select className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" value={config.aiProvider} onChange={e => setConfig({...config, aiProvider: e.target.value as AIProvider, aiModel: ''})}>
                            <option value="gemini">Google Gemini</option>
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic Claude</option>
                            <option value="groq">Groq</option>
                            <option value="openrouter">OpenRouter</option>
                        </select>
                    </div>

                    {config.aiProvider === 'gemini' && (
                        <>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Gemini API Key</label>
                                <input type="password" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Enter Gemini API Key" value={config.geminiApiKey || ''} onChange={e => setConfig({...config, geminiApiKey: e.target.value})} />
                            </div>
                            <select className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" value={config.aiModel} onChange={e => setConfig({...config, aiModel: e.target.value})}>
                                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            </select>
                        </>
                    )}

                    {config.aiProvider === 'openai' && (
                        <>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">OpenAI API Key</label>
                                <input type="password" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Enter OpenAI API Key" value={config.openaiApiKey || ''} onChange={e => setConfig({...config, openaiApiKey: e.target.value})} />
                            </div>
                            <select className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" value={config.aiModel} onChange={e => setConfig({...config, aiModel: e.target.value})}>
                                <option value="gpt-4o">GPT-4o (Recommended)</option>
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            </select>
                        </>
                    )}

                    {config.aiProvider === 'anthropic' && (
                        <>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Anthropic API Key</label>
                                <input type="password" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Enter Anthropic API Key" value={config.anthropicApiKey || ''} onChange={e => setConfig({...config, anthropicApiKey: e.target.value})} />
                            </div>
                            <select className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" value={config.aiModel} onChange={e => setConfig({...config, aiModel: e.target.value})}>
                                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                                <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                            </select>
                        </>
                    )}

                    {config.aiProvider === 'groq' && (
                        <>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Groq API Key</label>
                                <input type="password" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Enter Groq API Key" value={config.groqApiKey || ''} onChange={e => setConfig({...config, groqApiKey: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Model (Custom)</label>
                                <input type="text" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="e.g. llama-3.3-70b-versatile" value={config.customModel || ''} onChange={e => setConfig({...config, customModel: e.target.value})} />
                            </div>
                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                              <p className="text-xs text-purple-400">
                                <i className="fa-solid fa-bolt mr-2"></i>
                                Enter any Groq model name. Popular: llama-3.3-70b-versatile, mixtral-8x7b-32768
                              </p>
                            </div>
                        </>
                    )}

                    {config.aiProvider === 'openrouter' && (
                        <>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">OpenRouter API Key</label>
                                <input type="password" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Enter OpenRouter API Key" value={config.openrouterApiKey || ''} onChange={e => setConfig({...config, openrouterApiKey: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2 block">Model (Custom)</label>
                                <input type="text" className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="e.g. anthropic/claude-3.5-sonnet" value={config.customModel || ''} onChange={e => setConfig({...config, customModel: e.target.value})} />
                            </div>
                            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                              <p className="text-xs text-orange-400">
                                <i className="fa-solid fa-globe mr-2"></i>
                                Enter any OpenRouter model. Examples: anthropic/claude-3.5-sonnet, google/gemini-pro, meta-llama/llama-3.1-70b-instruct
                              </p>
                            </div>
                        </>
                    )}

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <p className="text-xs text-blue-400">
                        <i className="fa-solid fa-info-circle mr-2"></i>
                        {config.aiProvider === 'gemini' && 'Gemini 2.0 Flash provides the best balance of speed and accuracy.'}
                        {config.aiProvider === 'openai' && 'GPT-4o is recommended for highest quality product extraction.'}
                        {config.aiProvider === 'anthropic' && 'Claude 3.5 Sonnet offers excellent reasoning and accuracy.'}
                        {config.aiProvider === 'groq' && 'Groq provides ultra-fast inference for supported models.'}
                        {config.aiProvider === 'openrouter' && 'OpenRouter gives you access to 100+ models from one API.'}
                      </p>
                    </div>
                </div>
            )}

            {activeTab === 'sota' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between p-4 bg-dark-950 border border-dark-700 rounded-2xl">
                        <span className="text-xs font-bold">Inject JSON-LD Schema</span>
                        <input type="checkbox" checked={config.enableSchema} onChange={e => setConfig({...config, enableSchema: e.target.checked})} className="w-5 h-5 accent-brand-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-950 border border-dark-700 rounded-2xl">
                        <span className="text-xs font-bold">Precision Placement (Auto-Intro/Outro)</span>
                        <input type="checkbox" checked={config.enableStickyBar} onChange={e => setConfig({...config, enableStickyBar: e.target.checked})} className="w-5 h-5 accent-brand-500" />
                    </div>
                </div>
            )}

            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all">Save System Config</button>
          </form>
        </div>
      </div>
      )}
    </>
  );
};
