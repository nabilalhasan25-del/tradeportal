export const IDENTITY_ERRORS: Record<string, string> = {
    "PasswordRequiresLower": "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل ('a'-'z').",
    "PasswordRequiresUpper": "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل ('A'-'Z').",
    "PasswordRequiresDigit": "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9).",
    "PasswordRequiresNonAlphanumeric": "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (#، $، %، إلخ).",
    "PasswordTooShort": "كلمة المرور قصيرة جداً.",
    "DuplicateUserName": "اسم المستخدم هذا مستخدم بالفعل.",
    "DuplicateEmail": "البريد الإلكتروني هذا مستخدم بالفعل.",
};

export const VALIDATION_MESSAGES: Record<string, string> = {
    "The field Password must be a string or array type with a minimum length of '6'.": "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
    "The Password field is required.": "حقل كلمة المرور مطلوب.",
    "The Email field is required.": "حقل البريد الإلكتروني مطلوب.",
    "The UserName field is required.": "حقل اسم المستخدم مطلوب.",
    "The FullName field is required.": "حقل الاسم الكامل مطلوب.",
    "The CompanyName field is required.": "حقل اسم الشركة مطلوب.",
    "The CompanyTypeId field is required.": "حقل نوع الشركة مطلوب.",
    "The Feedback field is required.": "حقل الملاحظات مطلوب.",
    "The Comment field is required.": "حقل التعليق مطلوب.",
};

export const SYSTEM_ERRORS: Record<string, string> = {
    "Failed to fetch": "فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.",
    "Network Error": "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
    "Internal Server Error": "حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً.",
    "401": "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.",
    "403": "ليس لديك صلاحية للوصول إلى هذا المورد.",
    "404": "المورد المطلوب غير موجود.",
    "409": "يوجد تعارض في البيانات؛ الرقم أو الاسم مستخدم بالفعل.",
    "is invalid, can only contain letters or digits": "اسم المستخدم يحتوي على محارف غير مسموحة (يرجى استخدام الأحرف والأرقام فقط).",
    "Invalid credentials": "اسم المستخدم أو كلمة المرور غير صحيحة.",
    "User locked out": "تم قفل الحساب بسبب محاولات دخول خاطئة متكررة. يرجى المحاولة لاحقاً.",
    "User prohibited": "هذا الحساب غير مسموح له بالدخول.",
};

/**
 * وظيفة شاملة لترجمة أخطاء الـ API إلى العربية.
 * تتعامل مع أخطاء Identity Framework، وأخطاء التحقق القياسية، وأخطاء النظام العامة.
 */
export const translateError = (error: any): string => {
    if (!error) return "حدث خطأ غير متوقع";

    const errorStr = typeof error === 'string' ? error : (error.message || JSON.stringify(error));

    try {
        const parsed = JSON.parse(errorStr);

        // 1. أخطاء Identity Framework (Array: [{"code": "...", "description": "..."}])
        if (Array.isArray(parsed)) {
            return parsed.map(err => IDENTITY_ERRORS[err.code] || err.description).join(" \n ");
        }

        // 2. أخطاء Model Validation (ValidationProblemDetails: {"errors": {"Field": ["Msg"]}})
        if (parsed.errors && typeof parsed.errors === 'object') {
            const allErrors: string[] = [];
            Object.values(parsed.errors).forEach((errorMsgs: any) => {
                if (Array.isArray(errorMsgs)) {
                    errorMsgs.forEach(msg => {
                        allErrors.push(VALIDATION_MESSAGES[msg] || msg);
                    });
                }
            });
            if (allErrors.length > 0) return allErrors.join(" \n ");
        }

        // 3. كائن خطأ بسيط يحتوي على رسالة
        if (parsed.message) {
            return translateError(parsed.message);
        }
    } catch {
        // ليس JSON، نبحث في القوائم المباشرة
    }

    // البحث في رسائل التحقق المباشرة
    if (VALIDATION_MESSAGES[errorStr]) return VALIDATION_MESSAGES[errorStr];

    // البحث في أخطاء النظام
    for (const key in SYSTEM_ERRORS) {
        if (errorStr.includes(key)) return SYSTEM_ERRORS[key];
    }

    return errorStr;
};
