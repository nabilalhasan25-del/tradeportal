"use client";

import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '@/services/api';

interface PdfViewerProps {
    pdfPath: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if (pdfPath) {
            loadPdf();
        } else {
            setFileUrl(null);
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [pdfPath]);

    const loadPdf = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await api.getPdfBlob(pdfPath);
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
        } catch (err) {
            console.error("Error loading PDF:", err);
            setError("فشل تحميل ملف الـ PDF.");
        } finally {
            setLoading(false);
        }
    };

    if (!pdfPath) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 bg-muted/5">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p className="text-sm">لا يوجد ملف للعرض</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative bg-background">
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 font-bold">
                    <Loader2 className="w-8 h-8 text-sy-green animate-spin mb-2" />
                    <p className="text-[10px] text-muted-foreground">جاري تحميل المستند...</p>
                </div>
            )}

            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="w-10 h-10 text-sy-red mb-2" />
                    <p className="text-xs text-sy-red mb-4">{error}</p>
                    <button
                        onClick={loadPdf}
                        className="text-[10px] px-4 py-2 bg-sy-red text-white rounded-lg font-bold"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            ) : fileUrl && (
                <div className="h-full w-full">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
