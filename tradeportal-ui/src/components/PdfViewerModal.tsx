"use client";

import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { X, Loader2, Download, Maximize2, Minimize2 } from 'lucide-react';
import api from '@/services/api';

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfPath: string;
    title?: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, pdfPath, title = "معاينة الملف" }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if (isOpen && pdfPath) {
            loadPdf();
        } else {
            // Cleanup URL when modal closes
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
                setFileUrl(null);
            }
        }
    }, [isOpen, pdfPath]);

    const loadPdf = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await api.getPdfBlob(pdfPath);
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
        } catch (err) {
            console.error("Error loading PDF:", err);
            setError("فشل تحميل ملف الـ PDF. قد يكون الرابط غير صحيح أو لا تملك الصلاحية.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className={`bg-card w-full flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border transition-all duration-500 ${isFullscreen ? 'h-full max-w-full' : 'h-[90vh] max-w-5xl'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sy-red/10 flex items-center justify-center border border-sy-red/20 shadow-sm">
                            <svg className="w-6 h-6 text-sy-red" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm7 1.5L18.5 9H14V3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{title}</h3>
                            {pdfPath && <p className="text-[10px] text-muted-foreground opacity-70 truncate max-w-[200px] text-left" dir="ltr">{pdfPath.split('/').pop()}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                download={pdfPath.split('/').pop()}
                                className="p-2.5 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-sy-green"
                                title="تحميل الملف"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2.5 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-sy-gold"
                            title={isFullscreen ? "تصغير" : "ملء الشاشة"}
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-sy-red/10 rounded-lg transition-colors text-muted-foreground hover:text-sy-red"
                            title="إغلاق"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-muted/10 relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 backdrop-blur-xs z-10 animate-in fade-in">
                            <Loader2 className="w-12 h-12 text-sy-green animate-spin mb-4" />
                            <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري تحضير الملف للعرض...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-sy-red/10 rounded-full flex items-center justify-center mb-4">
                                <X className="w-10 h-10 text-sy-red" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-2">خطأ في التحميل</h4>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
                            <button
                                onClick={loadPdf}
                                className="px-6 py-2.5 bg-sy-red text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-sy-red/20"
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    )}

                    {!loading && !error && fileUrl && (
                        <div className="h-full w-full">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                            </Worker>
                        </div>
                    )}
                </div>

                {/* Footer / Status */}
                {!loading && !error && (
                    <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sy-green animate-pulse"></span>
                            تم التحقق من الوثيقة وهي جاهزة للمعاينة
                        </p>
                        <button
                            onClick={onClose}
                            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            إغلاق المعاينة
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfViewerModal;
