import React, { useContext, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { Settings as SettingsIcon, Save, Bell, Shield, Palette, Database, Mail, Volume2, LayoutDashboard, Moon, Sun, Check } from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'
import { toast } from 'react-toastify'

function Toggle({ enabled, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shadow-inner ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'right-1' : 'left-1'}`} />
        </button>
    )
}

function Settings() {
    const { isDark, setIsDark, settings, toggleSetting } = useContext(themeDataContext)
    const [saved, setSaved] = useState(false)
    const dk = isDark

    const handleSave = () => {
        setSaved(true)
        toast.success('Settings saved successfully!')
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className={`w-full min-h-screen flex flex-col transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <Nav />
            <div className='flex flex-1'>
                <Sidebar />

                <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>
                    <div className='max-w-4xl mx-auto'>

                        {/* Header */}
                        <div className='mb-8'>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className={`p-2 shadow-lg text-white rounded-lg ${dk ? 'bg-blue-600 shadow-blue-600/20' : 'bg-gray-900 shadow-gray-900/20'}`}>
                                    <SettingsIcon size={20} />
                                </div>
                                <h1 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>System Global Configuration</h1>
                            </div>
                            <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Control your dashboard preferences and administrative global configurations.</p>
                        </div>

                        <div className='space-y-6 animate-fade-in-up'>

                            {/* Theme Mode Card */}
                            <div className={`p-6 sm:p-8 rounded-[32px] border transition-all duration-500 ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/20' : 'bg-white border-gray-100 shadow-gray-200/40'}`}>
                                <div className='flex items-center gap-3 mb-8'>
                                    <div className={`p-2 rounded-lg ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <Palette size={18} />
                                    </div>
                                    <h3 className={`text-[15px] font-black uppercase tracking-widest ${dk ? 'text-white' : 'text-gray-900'}`}>Interface & Appearance</h3>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                    <div className='space-y-2'>
                                        <label className={`text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Admin Branding</label>
                                        <input
                                            type="text"
                                            defaultValue="VEBStore Management Hub"
                                            className={`w-full h-14 px-5 rounded-2xl text-[13px] font-black outline-none border transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 ${dk ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className={`text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Experience Mode</label>
                                        <div className={`flex gap-2 p-1.5 rounded-2xl border transition-all ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                                            <button
                                                onClick={() => setIsDark(false)}
                                                className={`flex-1 h-11 text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${!isDark ? 'bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                <Sun size={14} /> Light
                                            </button>
                                            <button
                                                onClick={() => setIsDark(true)}
                                                className={`flex-1 h-11 text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-slate-800 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-slate-700' : 'text-gray-400 hover:text-gray-700'}`}
                                            >
                                                <Moon size={14} /> Dark
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Dark mode live preview */}
                                <div className={`mt-8 p-6 rounded-2xl border flex items-center gap-5 transition-all duration-500 ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dk ? 'bg-blue-600/10' : 'bg-white shadow-sm'}`}>
                                        {dk ? <Moon size={22} className='text-blue-400 animate-pulse' /> : <Sun size={22} className='text-amber-500' />}
                                    </div>
                                    <div className='flex-1'>
                                        <p className={`text-[15px] font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>
                                            {dk ? 'Signature Dark Mode Active' : 'Classic Light Mode Enabled'}
                                        </p>
                                        <p className={`text-xs font-medium leading-relaxed ${dk ? 'text-slate-500' : 'text-gray-500'}`}>
                                            {dk ? 'A high-contrast professional workspace designed for visual clarity.' : 'Clean workspace optimized for maximum focus and daylight readability.'}
                                        </p>
                                    </div>
                                    <div className={`hidden sm:flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${dk ? 'bg-indigo-900/30 text-indigo-400 border-indigo-700/50' : 'bg-white text-blue-600 border-blue-100'}`}>
                                        ACTIVE
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Preferences */}
                            <div className={`p-8 rounded-[32px] border shadow-xl divide-y transition-colors duration-500 ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/20 divide-slate-700/50' : 'bg-white border-gray-100 shadow-gray-200/40 divide-gray-50'}`}>
                                {Object.entries({
                                    orderNotifications: { icon: Bell, color: 'amber', label: 'Order Notifications', desc: 'Real-time desktop alerts for every transaction.' },
                                    twoFactorAuth: { icon: Shield, color: 'rose', label: 'Administrative Shield', desc: 'Require 2FA for all administrative data operations.' },
                                    autoBackup: { icon: Database, color: 'emerald', label: 'Automated Repository Backup', desc: 'Mirror database states to secure cloud storage daily.' },
                                    emailAlerts: { icon: Mail, color: 'blue', label: 'Critical Email Dispatch', desc: 'High-priority alerts sent directly to registered admin email.' },
                                    compactMode: { icon: LayoutDashboard, color: 'violet', label: 'Focus Grid Display', desc: 'Optimized high-density interface for mass data management.' },
                                    soundAlerts: { icon: Volume2, color: 'pink', label: 'Audio Signal Chimes', desc: 'Distinct audio feedback for new incoming orders.' }
                                }).map(([key, config]) => (
                                    <div key={key} className='flex items-center justify-between py-5 first:pt-0 last:pb-0'>
                                        <div className='flex gap-5 items-center'>
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${dk ? `bg-${config.color}-900/20 text-${config.color}-400` : `bg-${config.color}-50 text-${config.color}-600`}`}>
                                                <config.icon size={20} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>{config.label}</p>
                                                <p className={`text-xs font-medium ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{config.desc}</p>
                                            </div>
                                        </div>
                                        <Toggle enabled={settings[key]} onToggle={() => toggleSetting(key)} />
                                    </div>
                                ))}
                            </div>

                            {/* Summary & Save */}
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
                                <div className={`p-5 px-8 rounded-2xl border flex flex-wrap gap-2 flex-1 transition-all ${dk ? 'bg-slate-800/40 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
                                    {Object.entries(settings).filter(([, v]) => v).map(([k]) => (
                                        <span key={k} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${dk ? 'bg-[#0f172a] text-blue-400 border border-slate-700' : 'bg-white text-blue-600 border border-blue-200'}`}>
                                            <Check size={10} /> {k.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={handleSave}
                                    className={`h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all active:scale-[0.98] ${saved ? 'bg-emerald-600 text-white shadow-emerald-500/30' : dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' : 'bg-gray-900 text-white'}`}
                                >
                                    {saved ? <><Check size={18} /> Configuration Stored</> : <><Save size={18} /> Update Global Settings</>}
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Settings
