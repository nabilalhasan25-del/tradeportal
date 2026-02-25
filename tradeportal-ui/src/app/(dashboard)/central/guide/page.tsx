"use client";

import React, { useState } from 'react';
import {
    Users, Key, Shield, ShieldCheck, UserCheck,
    Cpu, Settings, ExternalLink, Copy,
    CheckCircle2, AlertCircle, Info, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const usersList = [
    { role: "Admin", username: "admin", password: "Admin@123", name: "مدير النظام", icon: <Shield className="w-4 h-4" />, color: "sy-gold" },
    { role: "Auditor Admin", username: "auditoradmin", password: "Auditor@123", name: "أحمد مدير التدقيق", icon: <ShieldCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "Central Auditor", username: "auditor1", password: "Auditor@123", name: "سمير المدقق", icon: <UserCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "IP Admin", username: "ipadmin", password: "IpExpert@123", name: "سارة مديرة الملكية", icon: <ShieldCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "IP Expert", username: "ipexpert1", password: "IpExpert@123", name: "منى خبيرة الملكية", icon: <UserCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "Director", username: "director1", password: "Director@123", name: "د. سامر مدير الشركات", icon: <Shield className="w-4 h-4" />, color: "sy-gold" },
    { role: "Minister Assistant", username: "minister1", password: "Minister@123", name: "معاون الوزير", icon: <Shield className="w-4 h-4" />, color: "sy-gold" },
    { role: "Registry Officer", username: "registrar1", password: "Registry@123", name: "أمين السجل التجاري", icon: <UserCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "Province Admin", username: "provadmin1", password: "Province@123", name: "محمد المحافظة", icon: <ShieldCheck className="w-4 h-4" />, color: "sy-green" },
    { role: "Province Employee", username: "provemp1", password: "Province@123", name: "علي موظف المحافظة", icon: <UserCheck className="w-4 h-4" />, color: "sy-green" },
];

const deploymentSteps = [
    {
        title: "إعداد السيرفر والبرامج الأساسية",
        icon: <Settings className="w-5 h-5" />,
        color: "sy-gold",
        details: [
            "تثبيت متصفح Google Chrome عبر PowerShell لتجاوز قيود IE.",
            "تثبيت ASP.NET Core Hosting Bundle (الإصدار 9.0.2 لضمان التوافق).",
            "تثبيت MySQL Server 8.0.33 وأداة HeidiSQL لإدارة البيانات.",
            "إعداد البيئة البرمجية: Node.js (LTS)، PM2، و Git for Windows."
        ]
    },
    {
        title: "نشر الباك إيند (IIS & API)",
        icon: <ShieldCheck className="w-5 h-5" />,
        color: "sy-green",
        code: "dotnet publish -c Release -o C:\\inetpub\\tradeportal-api",
        details: ["إنشاء موقع TradePortalAPI على المنفذ 5000."]
    },
    {
        title: "نشر الواجهة (Next.js & PM2)",
        icon: <Zap className="w-5 h-5" />,
        color: "sy-gold",
        code: "pm2 start start-ui.bat --name \"tradeportal-ui\"",
        details: [
            "بناء المشروع (npm run build).",
            "إعداد ملف تشغيل start-ui.bat لضمان الاستقرار في الخلفية."
        ]
    },
    {
        title: "بوابة العبور (Reverse Proxy)",
        icon: <ExternalLink className="w-5 h-5" />,
        color: "sy-green",
        details: [
            "تثبيت ملحقات URL Rewrite و ARR 3.0.",
            "تفعيل Enable Proxy في إعدادات Application Request Routing.",
            "توجيه المنفذ 80 إلى 3000 لتمكين الوصول المباشر."
        ]
    },
    {
        title: "جدار الحماية (Firewall)",
        icon: <Shield className="w-5 h-5" />,
        color: "sy-red",
        code: "New-NetFirewallRule -LocalPort 80, 5000, 3000, 3306 -Protocol TCP",
        details: ["فتح جميع المنافذ اللازمة للتواصل الخارجي وإدارة البيانات."]
    }
];

export default function GuidePage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div className="text-center space-y-3">
                <div className="inline-flex p-3 bg-sy-green/10 rounded-full mb-2">
                    <Users className="w-8 h-8 text-sy-green" />
                </div>
                <h1 className="text-3xl font-black text-foreground">دليل الوصول والنشر</h1>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto font-medium">
                    لوحة تحكم شاملة لإدارة الحسابات، الذكاء الاصطناعي، ومتابعة سجلات النشر على السيرفر.
                </p>
            </div>

            {/* AI Guide Section */}
            <section className="glass-card p-6 relative overflow-hidden group shadow-xl border-sy-gold/20 bg-gradient-to-br from-sy-gold/5 via-background to-background">
                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    <div className="bg-sy-gold/20 p-4 rounded-2xl">
                        <Cpu className="w-8 h-8 text-sy-gold" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className="text-xl font-bold text-foreground">تفعيل الذكاء الاصطناعي البديل (Groq)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background/50 border border-sy-gold/10 rounded-xl space-y-2">
                                <h4 className="font-bold text-xs flex items-center gap-2">مفتاح الـ API الأساسي</h4>
                                <ConfigItem label="المزود" value="Groq" />
                            </div>
                            <div className="p-4 bg-background/50 border border-sy-gold/10 rounded-xl space-y-2">
                                <h4 className="font-bold text-xs">إعدادات الموديل</h4>
                                <ConfigItem label="الموديل" value="llama-3.3-70b-versatile" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Users Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                        <Key className="w-5 h-5 text-sy-green" />
                        بيانات الدخول الافتراضية
                    </h2>
                    <div className="bg-sy-green/10 text-sy-green px-3 py-1 rounded-xl text-[10px] font-bold">
                        {usersList.length} حساب متاح
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {usersList.map((user, idx) => (
                        <div key={idx} className="glass-card p-4 border-sy-green/10 hover:border-sy-green/30 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-sy-green/10 text-sy-green">
                                    {user.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-[11px] truncate">{user.name}</h3>
                                    <p className="text-[9px] text-muted-foreground font-bold truncate opacity-60">{user.role}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CopyBox label="اليوزر" value={user.username} onCopy={() => handleCopy(user.username, `${idx}-u`)} isCopied={copied === `${idx}-u`} />
                                <CopyBox label="الرمز" value={user.password} onCopy={() => handleCopy(user.password, `${idx}-p`)} isCopied={copied === `${idx}-p`} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visual Deployment Section */}
            <section className="space-y-8 pt-10 border-t border-border/50">
                <div className="text-right space-y-1">
                    <h2 className="text-2xl font-black text-foreground">سجل خطوات النشر والتشغيل</h2>
                    <p className="text-xs text-muted-foreground">التوثيق الفني الكامل لبيئة سيرفر Windows Server 2019.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deploymentSteps.map((step, idx) => (
                        <div key={idx} className="glass-card p-6 border-sy-green/5 hover:border-sy-green/20 transition-all flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-${step.color}/10 text-${step.color}`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-sm font-black">{step.title}</h3>
                                <span className="mr-auto text-[10px] font-bold opacity-20 text-foreground">STEP 0{idx + 1}</span>
                            </div>
                            <ul className="space-y-2 flex-1">
                                {step.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
                                        <div className="w-1 h-1 rounded-full bg-sy-green mt-1.5 shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                            {step.code && (
                                <div className="mt-2 p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-sy-gold group relative cursor-pointer" onClick={() => handleCopy(step.code!, `code-${idx}`)}>
                                    <Copy className="absolute left-3 top-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {copied === `code-${idx}` ? "تم النسخ!" : step.code}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick References Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickRef label="رابط الواجهة" value="SERVER_IP" />
                    <QuickRef label="رابط Swagger" value="SERVER_IP:5000" />
                    <QuickRef label="إدارة البيانات" value="HeidiSQL" />
                </div>
            </section>

            <div className="p-4 bg-sy-red/5 border border-sy-red/20 rounded-2xl flex items-center gap-4 text-sy-red">
                <AlertCircle className="w-5 h-5" />
                <p className="text-[10px] font-bold leading-relaxed">
                    تنبيه أمني: هذه الصفحة مخصصة لبيئة التطوير والتسليم. يرجى حجبها قبل الإطلاق الرسمي.
                </p>
            </div>
        </div>
    );
}

function QuickRef({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-center space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
            <p className="text-xs font-mono font-black text-sy-green">{value}</p>
        </div>
    );
}

function ConfigItem({ label, value }: { label: string, value: string }) {
    const [isCopied, setIsCopied] = React.useState(false);
    return (
        <div className="flex items-center justify-between group/item">
            <span className="text-[9px] text-muted-foreground font-bold">{label}:</span>
            <button onClick={() => { navigator.clipboard.writeText(value); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="text-[10px] font-mono font-bold bg-background p-1 px-2 rounded-lg border border-border/30 flex items-center gap-2 hover:border-sy-gold transition-all">
                <span className="truncate max-w-[100px]">{value}</span>
                {isCopied ? <CheckCircle2 className="w-3 h-3 text-sy-green" /> : <Copy className="w-3 h-3 text-muted-foreground group-hover/item:text-sy-gold" />}
            </button>
        </div>
    );
}

function CopyBox({ label, value, onCopy, isCopied }: any) {
    return (
        <button onClick={onCopy} className="w-full flex items-center justify-between p-2 bg-muted/40 rounded-lg border border-border/30 hover:bg-muted/60 transition-all text-[10px] font-mono group">
            <div className="flex flex-col items-start">
                <span className="text-[8px] opacity-50 font-sans leading-none mb-0.5">{label}</span>
                <span className="truncate">{value}</span>
            </div>
            {isCopied ? <CheckCircle2 className="w-3 h-3 text-sy-green" /> : <Copy className="w-3 h-3 text-muted-foreground group-hover:text-sy-green" />}
        </button>
    );
}
