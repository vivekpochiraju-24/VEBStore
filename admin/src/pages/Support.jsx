import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { HelpCircle, Mail, MessageCircle, Phone, FileText, Globe, ArrowRight } from 'lucide-react'

function Support() {
    return (
        <div className='w-full min-h-screen bg-[#f8fafc] flex flex-col'>
            <Nav />
            <div className='flex flex-1'>
                <Sidebar />

                <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>

                    <div className='max-w-4xl mx-auto'>
                        {/* Header */}
                        <div className='mb-8 text-center'>
                            <div className='p-3 bg-blue-600 shadow-xl shadow-blue-600/20 text-white rounded-2xl inline-flex mb-4'>
                                <HelpCircle size={32} />
                            </div>
                            <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Infrastructure Support</h1>
                            <p className='text-gray-500 text-sm font-medium mt-2'>Welcome to the Administrator Command Center Support Hub.</p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up'>

                            {/* Support Channels */}
                            <div className='bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 group hover:border-blue-200 transition-all'>
                                <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6'>
                                    <Mail size={24} />
                                </div>
                                <h3 className='text-lg font-bold text-gray-900 mb-2'>Technical Desk</h3>
                                <p className='text-xs text-gray-400 font-medium mb-6 leading-relaxed'>Direct contact for server-side configurations and infrastructure stability issues.</p>
                                <a href="mailto:admin-support@vebstore.com" className='text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all'>
                                    Open Ticket <ArrowRight size={14} />
                                </a>
                            </div>

                            <div className='bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 group hover:border-emerald-200 transition-all'>
                                <div className='w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6'>
                                    <MessageCircle size={24} />
                                </div>
                                <h3 className='text-lg font-bold text-gray-900 mb-2'>Logistics Support</h3>
                                <p className='text-xs text-gray-400 font-medium mb-6 leading-relaxed'>Coordinate with our shipping partners and supply chain management desk.</p>
                                <button className='text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all'>
                                    Start Telegram Chat <ArrowRight size={14} />
                                </button>
                            </div>

                            {/* Documentation / Knowledge Base */}
                            <div className='md:col-span-2 bg-[#0f172a] p-10 rounded-[40px] shadow-2xl relative overflow-hidden group'>
                                <div className='relative z-10'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 bg-blue-500/10 rounded-lg'>
                                            <FileText size={20} className='text-blue-400' />
                                        </div>
                                        <span className='text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]'>System Core Library</span>
                                    </div>
                                    
                                    <h3 className='text-3xl font-black text-white mb-4 tracking-tight'>Knowledge Base <span className='text-slate-500 block text-lg font-bold mt-1'>Admin Infrastructure Documentation</span></h3>
                                    
                                    <p className='text-slate-400 text-sm mb-10 max-w-xl font-medium leading-relaxed'>
                                        Master the VEBStore ecosystem with detailed guides on product bulk-upload, 
                                        real-time order fulfillment workflows, and secure API management protocols.
                                    </p>
                                    
                                    <div className='flex flex-wrap gap-5'>
                                        <button className='px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 hover:bg-blue-500 transition-all'>Access Library</button>
                                        <button className='px-10 py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-all'>Developer API Docs</button>
                                    </div>
                                </div>
                                
                                {/* Realistic Blueprint Background Effect */}
                                <div className='absolute right-[-5%] bottom-[-10%] opacity-10 pointer-events-none'>
                                    <div className='w-96 h-96 border-[40px] border-blue-400 rounded-full'></div>
                                </div>
                                <div className='absolute right-[10%] top-[10%] opacity-5 pointer-events-none'>
                                    <div className='grid grid-cols-6 gap-2'>
                                        {[...Array(24)].map((_, i) => (
                                            <div key={i} className='w-2 h-2 bg-white rounded-full'></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className='mt-12 flex flex-col items-center gap-4 py-8 border-t border-gray-100'>
                            <div className='flex gap-10'>
                                <div className='text-center'>
                                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1'>Emergency Line</p>
                                    <p className='text-sm font-black text-gray-900'>+91 9603673436</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1'>System Status</p>
                                    <div className='flex items-center gap-1.5 justify-center'>
                                        <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                                        <p className='text-sm font-black text-gray-900'>Optimal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    )
}

export default Support
