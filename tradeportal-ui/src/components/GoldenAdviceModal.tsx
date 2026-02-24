"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X, MessageCircle, Sparkles, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';

interface GoldenAdviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    advice: string;
    companyName: string;
}

const GoldenAdviceModal: React.FC<GoldenAdviceModalProps> = ({ isOpen, onClose, advice, companyName }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(advice);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="bg-card w-full max-w-xl max-h-[85vh] flex flex-col rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollbar Customization - Pure CSS Injection */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(212, 175, 55, 0.2);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(212, 175, 55, 0.4);
                    }
                ` }} />

                {/* Header Section */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-sy-gold/10 to-transparent">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Sparkles className="w-24 h-24 text-sy-gold rotate-12" />
                    </div>

                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sy-gold to-sy-gold/70 flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(212,175,55,0.4)]">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-foreground tracking-tight">التقرير الذهبي</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sy-green animate-pulse" />
                                    <p className="text-[11px] font-bold text-muted-foreground">شركة: <span className="text-sy-gold">{companyName}</span></p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2.5 bg-muted/50 hover:bg-sy-red/10 rounded-full transition-all text-muted-foreground hover:text-sy-red hover:rotate-90"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                    <div className="bg-muted/30 rounded-[2rem] p-7 border border-white/5 shadow-inner text-right">
                        <div className="prose prose-sm dark:prose-invert max-w-none 
                            prose-headings:text-sy-gold prose-headings:font-black prose-headings:mb-4 prose-headings:mt-6 first:prose-headings:mt-0
                            prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:font-bold prose-p:mb-4
                            prose-li:text-foreground/80 prose-li:font-bold prose-li:mb-2
                            prose-strong:text-sy-green prose-strong:font-black
                            prose-ul:my-4 prose-ul:list-disc prose-ul:pr-4
                        " dir="rtl">
                            <ReactMarkdown>{advice || "جاري استحضار النصيحة الاستشارية..."}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="mt-6 p-5 bg-sy-gold/5 rounded-2xl border border-sy-gold/10 flex items-start gap-4 text-right">
                        <div className="p-2 bg-sy-gold/10 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-sy-gold shrink-0" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-sy-gold">تنبيه استشاري:</p>
                            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                                هذا التقرير مبني على معايير وقوانين وزارة التجارة الداخلية السورية. يرجى اعتباره مرجعاً تطويرياً لضمان قبول الطلب.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-8 bg-muted/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border-2 border-card bg-sy-green/20 flex items-center justify-center text-sy-green"><CheckCircle2 className="w-3 h-3" /></div>
                            <div className="w-6 h-6 rounded-full border-2 border-card bg-sy-gold/20 flex items-center justify-center text-sy-gold"><Sparkles className="w-3 h-3" /></div>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">تم التدقيق مقابل كافة التعاميم الوزارية</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleCopy}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border-2 border-border hover:border-sy-gold/30 hover:bg-sy-gold/5 transition-all text-xs font-black text-muted-foreground hover:text-sy-gold active:scale-95 group"
                        >
                            {copied ? <Check className="w-4 h-4 text-sy-green" /> : <Copy className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
                            {copied ? "تم النسخ" : "نسخ التقرير"}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-sy-gold to-yellow-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs hover:shadow-[0_8px_24px_-8px_rgba(212,175,55,1)] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-sy-gold/20"
                        >
                            فهمت، إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoldenAdviceModal;
