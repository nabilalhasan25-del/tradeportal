"use client";

import React from 'react';
import {
    Users, Key, Shield, ShieldCheck, UserCheck,
    Cpu, Zap, Settings, ExternalLink, Copy,
    CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { useState } from 'react';

const usersList = [
    { role: "Admin", username: "admin", password: "Admin@123", name: "مدير النظام", icon: <Shield className="w-5 h-5" />, color: "sy-gold" },
    { role: "Central Auditor Admin", username: "auditoradmin", password: "Auditor@123", name: "أحمد مدير التدقيق", icon: <ShieldCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "Central Auditor", username: "auditor1", password: "Auditor@123", name: "سمير المدقق", icon: <UserCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "IP Expert Admin", username: "ipadmin", password: "IpExpert@123", name: "سارة مديرة الملكية", icon: <ShieldCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "IP Expert", username: "ipexpert1", password: "IpExpert@123", name: "منى خبيرة الملكية", icon: <UserCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "Director", username: "director1", password: "Director@123", name: "د. سامر مدير الشركات", icon: <Shield className="w-5 h-5" />, color: "sy-gold" },
    { role: "Minister Assistant", username: "minister1", password: "Minister@123", name: "معاون الوزير", icon: <Shield className="w-5 h-5" />, color: "sy-gold" },
    { role: "Registry Officer", username: "registrar1", password: "Registry@123", name: "موظف السجل التجاري", icon: <UserCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "Province Admin", username: "provadmin1", password: "Province@123", name: "محمد مسؤول المحافظة", icon: <ShieldCheck className="w-5 h-5" />, color: "sy-green" },
    { role: "Province Employee", username: "provemp1", password: "Province@123", name: "علي موظف المحافظة", icon: <UserCheck className="w-5 h-5" />, color: "sy-green" },
];

export default function GuidePage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-sy-green flex items-center justify-center gap-4">
                    <Users className="w-10 h-10" />
                    دليل الوصول والذكاء الاصطناعي
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                    هذه الصفحة مخصصة للمطورين والمختبرين لتسهيل الانتقال بين الحسابات المختلفة وضبط إعدادات الذكاء الاصطناعي.
                </p>
            </div>

            {/* AI Guide Section */}
            <section className="glass-card p-10 relative overflow-hidden group shadow-2xl border-sy-gold/30 bg-gradient-to-br from-sy-gold/5 via-background to-background">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sy-gold/10 blur-[100px] -z-10 rounded-full animate-pulse" />

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="bg-sy-gold/20 p-5 rounded-3xl">
                        <Cpu className="w-12 h-12 text-sy-gold" />
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                تفعيل الذكاء الاصطناعي البديل (Groq)
                                <span className="text-[10px] bg-sy-gold/20 text-sy-gold px-3 py-1 rounded-full uppercase tracking-tighter">مجاني وسريع</span>
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                في حال استنفاد حصة Gemini، يمكنك استخدام Groq كبديل قوي ومجاني بالكامل لمتابعة عمليات فحص الأسماء التجارية.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="p-6 bg-background/50 border border-sy-gold/20 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sy-gold text-white flex items-center justify-center text-xs font-bold">1</div>
                                    <h4 className="font-bold text-sm">الحصول على مفتاح الـ API</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    اذهب إلى Groq Console واحصل على مفتاح مجاني فوراً.
                                </p>
                                <a
                                    href="https://console.groq.com/keys"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-sy-gold hover:underline"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Groq Console
                                </a>
                            </div>

                            <div className="p-6 bg-background/50 border border-sy-gold/20 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sy-gold text-white flex items-center justify-center text-xs font-bold">2</div>
                                    <h4 className="font-bold text-sm">الإعدادات المطلوبة</h4>
                                </div>
                                <div className="space-y-3">
                                    <ConfigItem label="المزود (Provider)" value="Groq" />
                                    <ConfigItem label="الموديل (Model)" value="llama-3.3-70b-versatile" />
                                    <ConfigItem label="الرابط (Base URL)" value="https://api.groq.com/openai" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Users Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Key className="w-6 h-6 text-sy-green" />
                            بيانات الدخول الافتراضية
                        </h2>
                        <p className="text-xs text-muted-foreground">اضغط على اسم المستخدم أو كلمة المرور لنسخها فوراً.</p>
                    </div>
                    <div className="bg-sy-green/10 text-sy-green px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        إجمالي الحسابات: {usersList.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usersList.map((user, idx) => (
                        <div
                            key={idx}
                            className="glass-card p-6 border-sy-green/10 hover:border-sy-green/30 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-sy-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-2xl bg-sy-green/10 text-sy-green group-hover:scale-110 transition-transform`}>
                                    {user.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm truncate">{user.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{user.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <CopyBox
                                    label="اسم المستخدم"
                                    value={user.username}
                                    id={`${idx}-u`}
                                    onCopy={() => handleCopy(user.username, `${idx}-u`)}
                                    isCopied={copied === `${idx}-u`}
                                />
                                <CopyBox
                                    label="كلمة المرور"
                                    value={user.password}
                                    id={`${idx}-p`}
                                    onCopy={() => handleCopy(user.password, `${idx}-p`)}
                                    isCopied={copied === `${idx}-p`}
                                    isPassword
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-6 bg-sy-red/5 border border-sy-red/20 rounded-3xl flex items-center gap-4 text-sy-red">
                <AlertCircle className="w-6 h-6" />
                <p className="text-xs font-bold leading-relaxed">
                    تنبيه أمني: هذه الصفحة مخصصة لبيئة التطوير فقط. تأكد من إزالتها أو حجبها في بيئة الإنتاج الفعلية لضمان سلامة بيانات الدخول الافتراضية.
                </p>
            </div>
        </div>
    );
}

function ConfigItem({ label, value }: { label: string, value: string }) {
    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between group/item">
            <span className="text-[10px] text-muted-foreground font-bold">{label}:</span>
            <button
                onClick={handleCopy}
                className="text-[11px] font-mono font-bold bg-background p-1.5 px-3 rounded-lg border border-border/50 flex items-center gap-2 hover:border-sy-gold transition-all"
            >
                {value}
                {isCopied ? <CheckCircle2 className="w-3 h-3 text-sy-green" /> : <Copy className="w-3 h-3 text-muted-foreground group-hover/item:text-sy-gold" />}
            </button>
        </div>
    );
}

function CopyBox({ label, value, id, onCopy, isCopied, isPassword }: any) {
    return (
        <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground font-bold uppercase ml-1">{label}</span>
            <button
                onClick={onCopy}
                className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/40 hover:bg-muted/50 transition-all text-xs font-mono group"
            >
                <span className="truncate">{value}</span>
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-sy-green" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-sy-green" />}
            </button>
        </div>
    );
}
