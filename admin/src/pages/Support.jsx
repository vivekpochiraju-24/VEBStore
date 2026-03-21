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

                            {/* Documentation */}
                            <div className='md:col-span-2 bg-gray-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden'>
                                <div className='relative z-10'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <FileText size={16} className='text-blue-400' />
                                        <span className='text-[10px] font-black text-blue-400 uppercase tracking-widest'>Knowledge Base</span>
                                    </div>
                                    <h3 className='text-xl font-bold text-white mb-4'>Admin Infrastructure Documentation</h3>
                                    <p className='text-gray-400 text-sm mb-8 max-w-lg font-medium'>Access detailed guides on product bulk-upload, order fulfillment, and API management protocols.</p>
                                    <div className='flex flex-wrap gap-4'>
                                        <button className='px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all'>Access Library</button>
                                        <button className='px-6 py-3 bg-white/10 text-white border border-white/10 rounded-xl font-bold text-xs hover:bg-white/20 transition-all'>Developer API Docs</button>
                                    </div>
                                </div>
                                {/* Decorative element */}
                                <div className='absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]'></div>
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
