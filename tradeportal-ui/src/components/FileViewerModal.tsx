"use client";

import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { X, Loader2, Download, Maximize2, Minimize2, ZoomIn, ZoomOut, Maximize, FileText, ImageIcon, AlertCircle, ChevronRight } from 'lucide-react';
import api from '@/services/api';

interface FileViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    filePath: string;
    title?: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ isOpen, onClose, filePath, title = "معاينة الملف" }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageZoom, setImageZoom] = useState(1);
    const [isImageFit, setIsImageFit] = useState(true);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const isPdf = filePath?.toLowerCase().endsWith('.pdf');
    const isImage = filePath?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i);

    useEffect(() => {
        if (isOpen && filePath) {
            loadFile();
        } else {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
                setFileUrl(null);
            }
            setImageZoom(1);
            setIsImageFit(true);
        }
    }, [isOpen, filePath]);

    const loadFile = async () => {
        setLoading(true);
        setError(null);
        try {
            // We can reuse getPdfBlob as it just returns the blob from the server
            const blob = await api.getPdfBlob(filePath);
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
        } catch (err) {
            console.error("Error loading file:", err);
            setError("فشل تحميل الملف. قد يكون الرابط غير صحيح أو لا تملك الصلاحية.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className={`bg-card w-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden border border-border transition-all duration-500 ${isFullscreen ? 'h-full max-w-full' : 'h-[90vh] max-w-5xl'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${isPdf ? 'bg-sy-red/10 border-sy-red/20' : 'bg-sy-green/10 border-sy-green/20'}`}>
                            {isPdf ? <FileText className="w-6 h-6 text-sy-red" /> : <ImageIcon className="w-6 h-6 text-sy-green" />}
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-black text-foreground">{title}</h3>
                            {filePath && <p className="text-[10px] text-muted-foreground opacity-70 truncate max-w-[200px] font-mono" dir="ltr">{filePath.split('/').pop()}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isImage && !loading && !error && (
                            <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border mr-4">
                                <button onClick={() => setImageZoom(prev => Math.max(0.2, prev - 0.2))} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"><ZoomOut className="w-4 h-4" /></button>
                                <span className="text-[10px] font-bold min-w-[40px] text-center">{Math.round(imageZoom * 100)}%</span>
                                <button onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"><ZoomIn className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <button
                                    onClick={() => {
                                        setIsImageFit(!isImageFit);
                                        setImageZoom(1);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${isImageFit ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                                    title="احتواء في الشاشة"
                                >
                                    <Maximize className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {fileUrl && (
                            <a
                                href={fileUrl}
                                download={filePath.split('/').pop()}
                                className="p-3 hover:bg-sy-green/10 hover:text-sy-green rounded-xl transition-all text-muted-foreground bg-muted/50"
                                title="تحميل الملف"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-3 hover:bg-sy-gold/10 hover:text-sy-gold rounded-xl transition-all text-muted-foreground bg-muted/50"
                            title={isFullscreen ? "تصغير" : "ملء الشاشة"}
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-sy-red/10 hover:text-sy-red rounded-xl transition-all text-muted-foreground bg-muted/50"
                            title="إغلاق"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-zinc-900/50 relative overflow-hidden flex items-center justify-center">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-md z-10 animate-in fade-in">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-sy-green animate-spin mb-4" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-sy-green rounded-full animate-ping" />
                                </div>
                            </div>
                            <p className="text-sm font-black text-foreground animate-pulse">جاري تحضير الوثيقة للعرض...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-24 h-24 bg-sy-red/10 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-sy-red/5">
                                <X className="w-12 h-12 text-sy-red" />
                            </div>
                            <h4 className="text-xl font-black text-foreground mb-3">خطأ في تحميل الملف</h4>
                            <div className="space-y-2 mb-8">
                                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{error}</p>
                                <p className="text-[10px] text-muted-foreground font-mono bg-muted/30 p-2 rounded-lg break-all mx-auto max-w-sm" dir="ltr">
                                    Path: {filePath}
                                </p>
                            </div>
                            <button
                                onClick={loadFile}
                                className="px-8 py-3 bg-sy-red text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-sy-red/20 active:scale-95"
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    )}

                    {!loading && !error && fileUrl && (
                        <div className="h-full w-full flex items-center justify-center overflow-auto custom-scrollbar bg-checkered">
                            {isPdf ? (
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                    <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                                </Worker>
                            ) : isImage ? (
                                <div className={`flex items-center justify-center transition-all duration-300 ${isImageFit ? 'h-full w-full p-8' : ''}`}>
                                    <img
                                        src={fileUrl}
                                        alt="معاينة"
                                        style={{
                                            transform: `scale(${imageZoom})`,
                                            maxHeight: isImageFit ? '100%' : 'none',
                                            maxWidth: isImageFit ? '100%' : 'none',
                                            objectFit: 'contain',
                                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                                        }}
                                        className="rounded-lg transition-transform duration-200"
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-12">
                                    <AlertCircle className="w-16 h-16 text-sy-gold mx-auto mb-4" />
                                    <p className="font-bold text-foreground">نوع الملف غير مدعوم للمعاينة المباشرة</p>
                                    <a href={fileUrl} download className="text-sy-gold text-xs underline mt-2 block">تحميل الملف لمشاهدته</a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className="px-8 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-sy-green animate-pulse" />
                            <p className="text-[10px] font-bold text-muted-foreground">
                                تم التحقق من سلامة {isPdf ? 'الوثيقة' : 'الصورة'} وهي جاهزة للمعاينة
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-xs font-black text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
                        >
                            إغلاق المعاينة
                            <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileViewerModal;
