using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using TradePortal.Api.Hubs;
using TradePortal.Api.Dtos;
using TradePortal.Domain.Entities;
using TradePortal.Domain.Enums;
using TradePortal.Infrastructure.Data;
using TradePortal.Api.Helpers;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إدارة الطلبات (حجز الأسماء والعلامات التجارية)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Tags("إدارة الطلبات")]
public class RequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHubContext<TradePortalHub> _hubContext;
    private readonly NotificationHelper _notificationHelper;
    private readonly ILogger<RequestsController> _logger;

    public RequestsController(ApplicationDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService, IHubContext<TradePortalHub> hubContext, NotificationHelper notificationHelper, ILogger<RequestsController> logger)
    {
        _context = context;
        _userManager = userManager;
        _authorizationService = authorizationService;
        _hubContext = hubContext;
        _notificationHelper = notificationHelper;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (userIdClaim == null) throw new UnauthorizedAccessException("المستخدم غير مصرح له");
        return int.Parse(userIdClaim.Value);
    }

    private async Task<Request?> GetFullRequest(int id)
    {
        return await _context.Requests
            .Include(r => r.CompanyType)
            .Include(r => r.Province)
            .Include(r => r.Status)
            .Include(r => r.LockedBy)
            .Include(r => r.IpExpert)
            .Include(r => r.Invoice)
            .Include(r => r.History)
                .ThenInclude(h => h.User)
            .Include(r => r.SelectedPurposes)
                .ThenInclude(p => p.BusinessPurpose)
            .Include(r => r.ChecklistItems)
                .ThenInclude(ci => ci.Template)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    /// <summary>
    /// جلب قائمة الطلبات حسب الصلاحيات
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequests([FromQuery] int? statusId, [FromQuery] int? provinceId)
    {
        int userId;
        try { userId = GetUserId(); } catch { return Unauthorized(); }
        
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "";

        var query = _context.Requests
            .Include(r => r.CompanyType)
            .Include(r => r.Province)
            .Include(r => r.Status)
            .Include(r => r.LockedBy)
            .Include(r => r.IpExpert)
            .Include(r => r.History)
            .Include(r => r.SelectedPurposes)
                .ThenInclude(p => p.BusinessPurpose)
            .Include(r => r.ChecklistItems)
                .ThenInclude(ci => ci.Template)
            .Include(r => r.Invoice)
            .AsQueryable();

        // Auto-scope by role
        if (roles.Contains("Admin"))
        {
            // Admin sees all
        }
        else if (roles.Contains("ProvinceAdmin"))
        {
            // Province Admin sees all requests in their province
            query = query.Where(r => r.ProvinceId == user.ProvinceId);
        }
        else if (roles.Contains("ProvinceEmployee"))
        {
            // Provincial employees only see requests they submitted
            query = query.Where(r => r.SubmitterId == userId);
        }
        else if (roles.Contains("CentralAuditorAdmin"))
        {
            // Auditor Admin sees all auditor-relevant requests
            query = query.Where(r => 
                r.StatusId == 1 || r.StatusId == 2 || r.StatusId == 3 || 
                r.StatusId == 4 || r.StatusId == 5 || r.StatusId == 6 || 
                r.StatusId == 8 || r.StatusId == 9 || r.StatusId == 11 || 
                r.StatusId == 12 || r.StatusId == 14
            );
        }
        else if (roles.Contains("CentralAuditor"))
        {
            // Regular Auditor sees: Ready for Audit (2), IP Responded (4), or Referred (11)
            // Plus anything they have already locked.
            query = query.Where(r => 
                r.StatusId == 2 || r.StatusId == 4 || r.StatusId == 11 || 
                r.StatusId == 14 ||
                r.LockedById == userId
            );
        }
        else if (roles.Contains("IpExpertAdmin"))
        {
            // IP Admin sees: Pending (3, 4, 11) 
            // PLUS anything already processed by IP experts (to keep the archive full)
            query = query.Where(r => r.StatusId == 3 || r.StatusId == 4 || r.StatusId == 11 || r.IpExpertId != null);
        }
        else if (roles.Contains("IpExpert"))
        {
            // Regular IP Expert: same as Admin but restricted to assigned or unassigned
            // Plus anything already assigned to them (to maintain their "Resolved" archive)
            query = query.Where(r => (r.StatusId == 3 || r.StatusId == 4 || r.StatusId == 11) || 
                                     (r.IpExpertId == userId));
        }
        else if (roles.Contains("Director"))
        {
            // Director sees requests at Director stage (8) OR anything they've acted on
            query = query.Where(r => r.StatusId == 1 || r.StatusId == 8 || r.History.Any(h => h.UserId == userId));
        }
        else if (roles.Contains("MinisterAssistant"))
        {
            // Minister Assistant sees requests at Minister stage (9) OR anything they've acted on
            query = query.Where(r => r.StatusId == 9 || r.History.Any(h => h.UserId == userId));
        }
        else if (roles.Contains("RegistryOfficer"))
        {
            // Registry sees approved/finalized requests
            query = query.Where(r => r.StatusId == 5 || r.StatusId == 10 || r.StatusId == 12);
        }
        else
        {
            // Fallback for roles not defined: see nothing
            query = query.Where(r => false);
        }

        // Additional filters (on top of role scoping)
        if (statusId.HasValue) query = query.Where(r => r.StatusId == statusId);
        if (provinceId.HasValue) query = query.Where(r => r.ProvinceId == provinceId);

        var requests = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        return requests.Select(MapToDto).ToList();
    }

    /// <summary>
    /// إنشاء طلب جديد
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "إنشاء طلب جديد")]
    public async Task<ActionResult<RequestDto>> CreateRequest(CreateRequestDto dto)
    {
        int userId;
        try { userId = GetUserId(); } catch { return Unauthorized(); }

        // Check for name availability
        var normalizedInput = TradeNameNormalizer.Normalize(dto.CompanyName);
        var searchKey = !string.IsNullOrEmpty(normalizedInput) ? normalizedInput.Split(' ')[0] : dto.CompanyName;

        var candidates = await _context.Requests
            .Include(r => r.Status)
            .Where(r => r.CompanyName.Contains(searchKey) || r.CompanyName.Contains(dto.CompanyName)) 
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var existingRequest = candidates
            .FirstOrDefault(r => TradeNameNormalizer.Normalize(r.CompanyName) == normalizedInput);

        if (existingRequest != null)
        {
            // States to block: Accepted (5), Full Finalized (12), or any active state other than Rejected (6) or Released (13)
            if (existingRequest.StatusId == 5 || existingRequest.StatusId == 12 || (existingRequest.StatusId != 6 && existingRequest.StatusId != 13))
            {
                return Conflict($"الاسم '{dto.CompanyName}' مشابه جداً لاسم محجوز أو طلب نشط بالفعل.");
            }
        }

        var request = new Request
        {
            CompanyName = dto.CompanyName,
            NameEn = dto.NameEn,
            CompanyTypeId = dto.CompanyTypeId,
            ProvinceId = dto.ProvinceId,
            MainPdfPath = dto.MainPdfPath,
            SubmitterId = userId,
            StatusId = dto.IsPaid ? 7 : 2 // 7 = "بانتظار الدفع", 2 = "قيد التدقيق" (skip payment)
        };

        // Calculate Fee based on Province rules
        var provincialFees = await _context.ProvinceFeeRules
            .Where(f => f.ProvinceId == dto.ProvinceId && f.IsActive)
            .SumAsync(f => f.Amount);

        // Only generate invoice if payment is required
        if (dto.IsPaid)
        {
            if (provincialFees <= 0)
            {
                return BadRequest("لا يمكن تقديم الطلب لعدم وجود رسوم معرفة لهذه المحافظة. يرجى مراجعة إدارة النظام.");
            }

            var amount = provincialFees;

            // Generate Invoice with a professional, unique format
            var timestamp = DateTime.Now.ToString("yyyyMMdd");
            var uniquePart = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();
            
            var invoice = new Invoice
            {
                InvoiceNum = $"INV-{timestamp}-{uniquePart}",
                Amount = amount,
                Request = request
            };
            _context.Invoices.Add(invoice);
        }

        if (dto.SelectedPurposes != null)
        {
            foreach (var pInput in dto.SelectedPurposes)
            {
                request.SelectedPurposes.Add(new RequestBusinessPurpose 
                { 
                    BusinessPurposeId = pInput.PurposeId,
                    Complement = pInput.Complement
                });
            }
        }

        if (dto.ChecklistItems != null)
        {
            foreach (var cInput in dto.ChecklistItems)
            {
                request.ChecklistItems.Add(new RequestChecklist
                {
                    TemplateId = cInput.TemplateId,
                    IsProvided = cInput.IsProvided
                });
            }
        }

        _context.Requests.Add(request);

        // Audit Log
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = userId,
            Action = "CreateRequest",
            EntityName = "Request",
            NewValues = $"اسم الشركة: {dto.CompanyName}, أجنبي: {dto.NameEn}, مدفوع: {dto.IsPaid}",
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });

        try 
        {
            await _context.SaveChangesAsync();
            var fullRequest = await GetFullRequest(request.Id);
            var resultDto = MapToDto(fullRequest ?? request);
            
            // Notifications
            if (dto.IsPaid)
            {
                await _notificationHelper.NotifyUser(userId, "تم إنشاء الطلب", $"تم توليد فاتورة برقم {resultDto.InvoiceNum}. يرجى إدخال رقم الإيصال لتفعيل الطلب.", "invoice", request.Id);
            }
            else
            {
                await _notificationHelper.NotifyUser(userId, "تم إنشاء الطلب", $"تم إنشاء طلب شركة {dto.CompanyName} بدون رسوم وإرساله للتدقيق مباشرة.", "success", request.Id);
                await _notificationHelper.NotifyRole("CentralAuditor", "طلب جديد للتدقيق", $"طلب جديد من مديرية {resultDto.ProvinceName} — {dto.CompanyName} (بدون رسوم)", "new", request.Id);
            }
            
            // Broadcast new request to dashboards
            await _notificationHelper.BroadcastRequestCreated(resultDto);

            return CreatedAtAction(nameof(GetRequests), new { id = request.Id }, resultDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finalizing request creation for {CompanyName}", dto.CompanyName);
            return StatusCode(500, "حدث خطأ أثناء إتمام عملية إنشاء الطلب. تم حفظ البيانات ولكن فشلت الإشعارات.");
        }
    }

    /// <summary>
    /// تأكيد دفع الرسوم (إرفاق إيصال)
    /// </summary>
    [HttpPost("{id}/confirm-payment")]
    [Authorize]
    public async Task<ActionResult<RequestDto>> ConfirmPayment(int id, ConfirmPaymentDto dto)
    {
        var request = await _context.Requests.Include(r => r.Invoice).FirstOrDefaultAsync(r => r.Id == id);
        if (request == null || request.Invoice == null) return NotFound();

        int userId = GetUserId();
        
        request.Invoice.ReceiptNum = dto.ReceiptNum;
        request.Invoice.ReceiptPath = dto.ReceiptPath;
        request.Invoice.IsPaid = true;
        request.StatusId = 2; // "قيد التدقيق" (Ready for Audit)
        
        request.History.Add(new RequestAction
        {
            UserId = userId,
            Role = "ProvincialEmployee",
            ActionType = "PaymentConfirmed",
            Note = $"رقم الإيصال: {dto.ReceiptNum}"
        });

        await _context.SaveChangesAsync();

        await _notificationHelper.NotifyRole("CentralAuditor", "طلب جاهز للتدقيق (مدفوع)", $"تم تأكيد دفع رسوم شركة {request.CompanyName}", "info", request.Id);
        
        var resultDto = MapToDto(await GetFullRequest(id) ?? request);
        await _notificationHelper.BroadcastRequestUpdated(resultDto);

        return Ok(resultDto);
    }

    /// <summary>
    /// استلام الطلب للمراجعة أو الفحص الفني
    /// </summary>
    [HttpPost("{id}/take")]
    [Authorize] // Check specific role permissions inside
    public async Task<ActionResult> TakeRequest(int id)
    {
        int userId;
        try { userId = GetUserId(); } catch { return Unauthorized(); }

        var canAudit = await _authorizationService.AuthorizeAsync(User, "حجز الطلبات للتدقيق");
        var canIp = await _authorizationService.AuthorizeAsync(User, "استقبال طلبات الفحص");

        if (!canAudit.Succeeded && !canIp.Succeeded) return Forbid();

        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound("الطلب غير موجود");

        // IP Expert Logic: If at status 3 (Waiting for IP), they use IpExpertId
        if (canIp.Succeeded && request.StatusId == (int)RequestStatusEnum.PendingIpResponse)
        {
            if (request.IpExpertId != null) return Conflict("الطلب محجوز مسبقاً من قبل خبير ملكية آخر");
            request.IpExpertId = userId;
        }
        // Central Auditor Logic: If available for audit, they use LockedById
        else if (canAudit.Succeeded)
        {
            if (request.LockedById != null) return Conflict("الطلب محجوز مسبقاً من قبل موظف آخر");
            request.LockedById = userId;
            request.LockedAt = DateTime.UtcNow;
            if (request.StatusId == (int)RequestStatusEnum.New) request.StatusId = (int)RequestStatusEnum.InAuditing; // "قيد التدقيق"
        }
        else
        {
            return Forbid("لا يمكن استلام الطلب في حالته الحالية أو بصلاحياتك الحالية.");
        }

        _context.AuditLogs.Add(new AuditLog
        {
            UserId = userId,
            Action = "TakeRequest",
            EntityName = "Request",
            EntityId = id.ToString(),
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });

        await _context.SaveChangesAsync();
        
        var fullRequest = await GetFullRequest(id);
        
        if (fullRequest != null)
        {
            // إشعارات لمقدم الطلب وآدمن المحافظة
            await _notificationHelper.NotifyUsers(new[] { fullRequest.SubmitterId }, "تم استلام طلبك", $"بدأ المدقق المركزي بدراسة طلب {fullRequest.CompanyName}", "info", id);
            await _notificationHelper.NotifyRole("ProvinceAdmin", "تحديث كفالة", $"بدأ التدقيق على طلب شركة {fullRequest.CompanyName}", "info", id);
        }
        
        // بث تحديث لتغيير حالة القفل
        if (fullRequest != null)
        {
            await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest));
        }

        return Ok(new { message = "تم استلام الطلب بنجاح" });
    }

    /// <summary>
    /// تحرير الطلب وإلغاء حجز الموظف الحالي
    /// </summary>
    [HttpPost("{id}/release")]
    [Authorize(Policy = "اتخاذ القرار النهائي")]
    public async Task<ActionResult> ReleaseRequest(int id)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound("الطلب غير موجود");

        request.LockedById = null;
        request.LockedAt = null;
        request.StatusId = (int)RequestStatusEnum.New; // "جديد"

        int releaserId;
        try { releaserId = GetUserId(); } catch { return Unauthorized(); }
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = releaserId,
            Action = "ReleaseRequest",
            EntityName = "Request",
            EntityId = id.ToString(),
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = "تم تحرير الطلب" });
    }

    /// <summary>
    /// تحديث حالة الطلب (قبول، رفض، إضافة ملاحظات)
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize] // Handled per role inside
    public async Task<ActionResult> UpdateStatus(int id, UpdateRequestStatusDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound("الطلب غير موجود");

        int currentUserId;
        try { currentUserId = GetUserId(); } catch { return Unauthorized(); }

        // Determine if user has required permission for this specific status change
        // Status 5 (Accept), 6 (Reject) -> CentralAuditorAdmin Only (or Auditor if allowed)
        // Status 3 (Send to IP), 4 (Reply) -> Auditor or IP Expert
        
        var canFinalize = await _authorizationService.AuthorizeAsync(User, "اتخاذ القرار النهائي");
        var canIpReport = await _authorizationService.AuthorizeAsync(User, "إعداد التقارير الفنية");
        var canAudit = await _authorizationService.AuthorizeAsync(User, "إضافة ملاحظات داخلية");

        // Concurrency Check: 
        // 1. Only the owner of the lock can update.
        // 2. EXCEPT: An IP Expert assigned to this request can update to provide their verdict.
        // 3. EXCEPT: Admin.
        
        bool isAssignedExpert = request.IpExpertId == currentUserId;
        bool isLockOwner = request.LockedById == currentUserId;

        if (!isLockOwner && !isAssignedExpert && !User.IsInRole("Admin"))
        {
            return Forbid("هذا الطلب محجوز من قبل موظف آخر. لا يمكنك تعديله.");
        }

        if (!canFinalize.Succeeded && !canIpReport.Succeeded && !canAudit.Succeeded)
        {
            return Forbid("لا تملك صلاحية تعديل حالة الطلبات.");
        }

        // Logical safety: Expert can only move to "Responded" (4) or keep helping
        if (isAssignedExpert && !isLockOwner && dto.StatusId != (int)RequestStatusEnum.IpResponded && dto.StatusId != (int)RequestStatusEnum.PendingIpResponse)
        {
             return BadRequest("خبير الملكية يمكنه فقط تحديث الحالة إلى 'تم الرد'. القرار النهائي للمدقق.");
        }

        // Auditor/Admin cannot move to Accepted/Rejected if currently with Leadership 
        // This enforces the lock mentioned in the design.
        if (request.StatusId == (int)RequestStatusEnum.PendingDirectorReview || 
            request.StatusId == (int)RequestStatusEnum.PendingMinisterAssistantReview)
        {
            if (!User.IsInRole("Admin"))
                return BadRequest("الطلب قيد المراجعة القيادية حالياً. لا يمكن اتخاذ قرار نهائي قبل رد القيادة.");
        }

        // Enforce IP Consultation for Paid Requests
        // If the request has a paid invoice, it MUST be reviewed by an IP Expert before a final decision (Accept/Reject) can be made.
        if ((dto.StatusId == (int)RequestStatusEnum.Accepted || dto.StatusId == (int)RequestStatusEnum.Rejected))
        {
            // Check if the request is paid (InvoiceId exists and IsPaid is true)
            bool isPaid = false;
            if (request.InvoiceId.HasValue)
            {
                // We need to fetch the invoice to check its status if not already loaded
                var invoice = await _context.Invoices.FindAsync(request.InvoiceId.Value);
                if (invoice != null && invoice.IsPaid)
                {
                    isPaid = true;
                }
            }

            if (isPaid && request.IpExpertId == null && !User.IsInRole("Admin"))
            {
                return BadRequest("هذا الطلب يتضمن رسوم فحص مدفوعة؛ يجب تحويل الطلب لمديرية حماية الملكية أولاً للحصول على التقرير الفني قبل اتخاذ قرار نهائي.");
            }
        }

        request.StatusId = dto.StatusId;
        
        // Map Comment or AuditorFeedback to the model
        if (!string.IsNullOrEmpty(dto.Comment)) 
            request.AuditorFeedback = dto.Comment;
        else if (!string.IsNullOrEmpty(dto.AuditorFeedback)) 
            request.AuditorFeedback = dto.AuditorFeedback;
            
        if (dto.IpVerdict != null) request.IpVerdict = dto.IpVerdict;
        request.UpdatedAt = DateTime.UtcNow;

        int statusUserId;
        try { statusUserId = GetUserId(); } catch { return Unauthorized(); }
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = statusUserId,
            Action = "UpdateStatus",
            EntityName = "Request",
            EntityId = id.ToString(),
            OldValues = $"الحالة السابقة",
            NewValues = $"الحالة الجديدة: {dto.StatusId}",
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });

        // Add to Request History (ActionTimeline)
        string actionType = dto.StatusId switch
        {
            (int)RequestStatusEnum.PendingIpResponse => "ForwardedToIp",
            (int)RequestStatusEnum.IpResponded => "IpResponded",
            (int)RequestStatusEnum.Accepted => "AuditorAccepted",
            (int)RequestStatusEnum.Rejected => "AuditorRejected",
            _ => "StatusUpdated"
        };

        var userRoles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(statusUserId.ToString()));
        string userRole = userRoles.Contains("IpExpert") || userRoles.Contains("IpExpertAdmin") ? "IpExpert" : "CentralAuditor";

        request.History.Add(new RequestAction
        {
            UserId = statusUserId,
            Role = userRole,
            ActionType = actionType,
            Note = request.AuditorFeedback,
            IsInternal = true
        });

        await _context.SaveChangesAsync();

        var fullRequest = await GetFullRequest(id);

        if (fullRequest != null)
        {
            // إشعارات حسب الحالة
            if (dto.StatusId == (int)RequestStatusEnum.PendingIpResponse) // إرسال للملكية
            {
                await _notificationHelper.NotifyRole("IpExpert", "طلب استشارة فنية", $"طلب جديد بحاجة لرأيك الفني: {fullRequest.CompanyName}", "warning", id);
                await _notificationHelper.NotifyRole("IpExpertAdmin", "إرسال خبير", $"تم تحويل طلب {fullRequest.CompanyName} لقسمك", "info", id);
            }
            else if (dto.StatusId == (int)RequestStatusEnum.Accepted || dto.StatusId == (int)RequestStatusEnum.Rejected) // قبول أو رفض
{
    string statusAr = dto.StatusId == (int)RequestStatusEnum.Accepted ? "مقبول" : "مرفوض";
    string type = dto.StatusId == (int)RequestStatusEnum.Accepted ? "success" : "error";
                await _notificationHelper.NotifyUsers(new[] { fullRequest.SubmitterId }, $"القرار النهائي: {statusAr}", $"تم {statusAr} طلب شركة {fullRequest.CompanyName}", type, id);
                await _notificationHelper.NotifyRole("ProvinceAdmin", "قرار نهائي لطلب", $"تم {statusAr} طلب شركة {fullRequest.CompanyName}", type, id);
            }
        }

        // بث تحديث عند تغيير الحالة
        if (fullRequest != null)
        {
            await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest));
        }

        return Ok(new { message = "تم تحديث حالة الطلب" });
    }

    /// <summary>
    /// فحص توفر اسم تجاري أو وجود أسماء مماثلة
    /// </summary>
    [HttpGet("check-name")]
    [Authorize] // We will check permissions inside to allow multiple specific ones
    public async Task<ActionResult> CheckName([FromQuery] string name, [FromQuery] int? excludeId = null)
    {
        // Allow all authenticated users to check name availability
        // This avoids session termination caused by policy mismatch for certain roles

        int currentUserId;
        try { currentUserId = GetUserId(); } catch { return Unauthorized(); }

        if (excludeId.HasValue)
        {
            var currentReq = await _context.Requests.FindAsync(excludeId.Value);
            if (currentReq != null && currentReq.LockedById != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid("لا يمكنك فحص اسم لطلب محجوز لموظف آخر.");
            }
        }

        if (string.IsNullOrWhiteSpace(name)) return BadRequest("الاسم مطلوب");

        try {
            var normalizedInput = TradeNameNormalizer.Normalize(name);
            var searchKey = !string.IsNullOrEmpty(normalizedInput) ? normalizedInput.Split(' ')[0] : name;

            // Broad search
            var query = _context.Requests
                .Include(r => r.Status)
                .Include(r => r.Province)
                .Where(r => r.CompanyName.Contains(searchKey) || r.CompanyName.Contains(name));

            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            var candidates = await query
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            // Strict normalized check
            var matches = candidates
                .Where(r => TradeNameNormalizer.Normalize(r.CompanyName) == normalizedInput)
                .Select(r => new
                {
                    r.Id,
                    r.CompanyName,
                    r.StatusId,
                    StatusName = r.Status?.NameAr ?? "غير معروف",
                    ProvinceName = r.Province?.NameAr ?? "غير معروف",
                    r.CreatedAt
                }).ToList();

            return Ok(new
            {
                isAvailable = matches.Count == 0,
                count = matches.Count,
                matches = matches,
                normalizedKey = normalizedInput // Debug info
            });
        }
        catch (Exception ex) {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// إضافة التقرير الفني من قبل خبير الملكية
    /// </summary>
    [HttpPost("{id}/technical-report")]
    [Authorize]
    public async Task<ActionResult<RequestDto>> AddTechnicalReport(int id, [FromBody] TechnicalReportDto dto)
    {
        var request = await _context.Requests
            .Include(r => r.CompanyType)
            .Include(r => r.Province)
            .Include(r => r.Status)
            .Include(r => r.LockedBy)
            .Include(r => r.IpExpert)
            .Include(r => r.History)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return NotFound("الطلب غير موجود");

        int currentUserId;
        try { currentUserId = GetUserId(); } catch { return Unauthorized(); }

        // Only assigned expert or admin
        if (request.IpExpertId != currentUserId && !User.IsInRole("Admin"))
        {
            return Forbid("هذا الطلب محجوز من قبل خبير ملفات آخر.");
        }

        request.IpExpertFeedback = dto.Feedback;
        request.IpReportPath = dto.ReportPath;
        request.StatusId = (int)RequestStatusEnum.IpResponded; // تم الرد من خبير الملكية
        request.UpdatedAt = DateTime.UtcNow;

        request.History.Add(new RequestAction
        {
            UserId = currentUserId,
            Role = "IpExpert",
            ActionType = "IpResponded",
            Note = dto.Feedback,
            IsInternal = false // Visible to all
        });

        _context.AuditLogs.Add(new AuditLog
        {
            UserId = currentUserId,
            Action = "AddTechnicalReport",
            EntityName = "Request",
            EntityId = id.ToString(),
            NewValues = $"تقديم تقرير فني: {dto.Feedback.Substring(0, Math.Min(dto.Feedback.Length, 100))}",
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });

        await _context.SaveChangesAsync();
        
        var fullRequest = await GetFullRequest(id);

        if (fullRequest != null)
        {
            // إشعار للمدقق الذي يتابع الطلب
            if (fullRequest.LockedById.HasValue)
            {
                await _notificationHelper.NotifyUsers(new[] { fullRequest.LockedById.Value }, "وصل الرد الفني", $"قام خبير الملكية بإضافة تقريره لشركة {fullRequest.CompanyName}", "success", id);
            }
            await _notificationHelper.NotifyRole("CentralAuditorAdmin", "تقرير فني جاهز", $"تم استلام رد الملكية الفكرية لشركة {fullRequest.CompanyName}", "info", id);
            
            // بث تحديث عند إضافة تقرير فني
            await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest!));
        }
        
        return Ok(MapToDto(fullRequest!));
    }

    private static RequestDto MapToDto(Request r)
    {
        return new RequestDto
        {
            Id = r.Id,
            CompanyName = r.CompanyName,
            NameEn = r.NameEn,
            CompanyTypeId = r.CompanyTypeId,
            CompanyTypeName = r.CompanyType?.NameAr ?? "",
            ProvinceId = r.ProvinceId,
            ProvinceName = r.Province?.NameAr ?? "",
            StatusId = r.StatusId,
            StatusName = r.Status?.NameAr ?? "",
            StatusColor = r.Status?.ColorCode ?? "",
            AuditorFeedback = r.AuditorFeedback,
            IpVerdict = r.IpVerdict,
            LockedById = r.LockedById,
            LockedByName = r.LockedBy?.FullName ?? "",
            LockedAt = r.LockedAt,
            MainPdfPath = r.MainPdfPath,
            AttachmentPath = r.MainPdfPath,
            CreatedAt = r.CreatedAt,
            SubmissionDate = r.CreatedAt,
            UpdatedAt = r.UpdatedAt,
            IpExpertId = r.IpExpertId,
            IpExpertUserName = r.IpExpert?.FullName ?? "",
            IpExpertFeedback = r.IpExpertFeedback,
            IpReportPath = r.IpReportPath,
            
            // Registry & Reservation
            RegistryNumber = r.RegistryNumber,
            RegistryDate = r.RegistryDate,
            ReservationExpiryDate = r.ReservationExpiryDate,

            // Invoice
            InvoiceId = r.InvoiceId,
            InvoiceNum = r.Invoice?.InvoiceNum,
            IsPaid = r.Invoice?.IsPaid,
            ReceiptNum = r.Invoice?.ReceiptNum,
            ReceiptPath = r.Invoice?.ReceiptPath,

            SelectedPurposes = r.SelectedPurposes.Select(sp => new BusinessPurposeDto
            {
                Id = sp.BusinessPurposeId,
                ActivityCode = sp.BusinessPurpose?.ActivityCode ?? "",
                ActivityName = sp.BusinessPurpose?.ActivityName ?? "",
                ISIC4Code = sp.BusinessPurpose?.ISIC4Code ?? "",
                AuthorityName = sp.BusinessPurpose?.AuthorityName ?? "",
                ApprovalRequirement = sp.BusinessPurpose?.ApprovalRequirement ?? "",
                MinimumCapital = sp.BusinessPurpose?.MinimumCapital,
                Complement = sp.Complement
            }).ToList(),
            ChecklistItems = r.ChecklistItems.Select(ci => new RequestChecklistItemDto
            {
                TemplateId = ci.TemplateId,
                TemplateName = ci.Template?.ItemNameAr,
                IsProvided = ci.IsProvided
            }).ToList(),
            History = r.History.OrderByDescending(h => h.CreatedAt).Select(h => new RequestActionDto
            {
                UserId = h.UserId,
                UserName = h.User?.FullName,
                Role = h.Role,
                ActionType = h.ActionType,
                Note = h.Note,
                IsInternal = h.IsInternal,
                CreatedAt = h.CreatedAt
            }).ToList()
        };
    }

    /// <summary>
    /// تحويل الطلب للقيادة لاتخاذ قرار نهائي
    /// </summary>
    [HttpPost("{id}/forward-leadership")]
    [Authorize]
    public async Task<ActionResult<RequestDto>> ForwardToLeadership(int id, [FromBody] ForwardLeadershipDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound();

        int userId = GetUserId();
        
        if (dto.TargetRole == "Director")
        {
            // Enforce IP Consultation for Paid Requests
            bool isPaid = false;
            if (request.InvoiceId.HasValue)
            {
                var invoice = await _context.Invoices.FindAsync(request.InvoiceId.Value);
                if (invoice != null && invoice.IsPaid) isPaid = true;
            }

            if (isPaid && request.IpExpertId == null && !User.IsInRole("Admin"))
            {
                return BadRequest("هذا الطلب يتضمن رسوم فحص مدفوعة؛ يجب تحويل الطلب لمديرية حماية الملكية أولاً للحصول على التقرير الفني.");
            }

            // Anyone authorized (usually Auditor) can forward to Director
            request.StatusId = (int)RequestStatusEnum.PendingDirectorReview;
            request.History.Add(new RequestAction 
            { 
                UserId = userId, 
                Role = User.IsInRole("Admin") ? "Admin" : "CentralAuditor", 
                ActionType = "ForwardedToDirector", 
                Note = dto.Note ?? "تم رفع الملف للمدير" 
            });
            await _notificationHelper.NotifyRole("Director", "طلب جديد للمراجعة", $"تم تحويل طلب شركة {request.CompanyName} لمراجعتك", "info", id);
        }
        else if (dto.TargetRole == "MinisterAssistant")
        {
            // ONLY Director or Admin can forward to Minister Assistant
            if (!User.IsInRole("Director") && !User.IsInRole("Admin"))
            {
                return Forbid("لا تملك صلاحية تحويل الطلب لمعاون الوزير. التحويل محصور بمدير الشركات.");
            }

            request.StatusId = (int)RequestStatusEnum.PendingMinisterAssistantReview;
            request.History.Add(new RequestAction 
            { 
                UserId = userId, 
                Role = "Director", 
                ActionType = "ForwardedToMinister", 
                Note = dto.Note ?? "توصية بالموافقة" 
            });
            await _notificationHelper.NotifyRole("MinisterAssistant", "طلب جديد للمراجعة", $"تم تحويل طلب شركة {request.CompanyName} لمراجعتك", "info", id);
        }

        await _context.SaveChangesAsync();

        var fullRequest = await GetFullRequest(id);
        if (fullRequest != null) await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest));

        return Ok(MapToDto(request));
    }

    /// <summary>
    /// قرار المدير (موافقة أو رفض)
    /// </summary>
    [HttpPost("{id}/director-decision")]
    [Authorize(Roles = "Director,Admin")]
    public async Task<ActionResult<RequestDto>> DirectorDecision(int id, [FromBody] DirectorDecisionDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound();

        int userId = GetUserId();

        if (dto.Action == "return")
        {
            request.StatusId = (int)RequestStatusEnum.LeadershipResponded;
            request.History.Add(new RequestAction
            {
                UserId = userId,
                Role = "Director",
                ActionType = "DirectorReturned",
                Note = dto.Note,
                IsInternal = true
            });
            await _notificationHelper.NotifyRole("CentralAuditor", "رد قيادي (المدير)", $"قام مدير الشركات بإرجاع طلب شركة {request.CompanyName} مع ملاحظات", "warning", id);
        }
        else if (dto.Action == "forward")
        {
            request.StatusId = (int)RequestStatusEnum.PendingMinisterAssistantReview;
            request.History.Add(new RequestAction
            {
                UserId = userId,
                Role = "Director",
                ActionType = "DirectorForwarded",
                Note = dto.Note,
                IsInternal = true
            });
            await _notificationHelper.NotifyRole("MinisterAssistant", "طلب محول من المدير", $"قام مدير الشركات بتحويل طلب {request.CompanyName} لمراجعتك", "info", id);
        }
        else // "approve"
        {
            request.StatusId = (int)RequestStatusEnum.LeadershipResponded;
            request.History.Add(new RequestAction
            {
                UserId = userId,
                Role = "Director",
                ActionType = "DirectorApproved",
                Note = dto.Note,
                IsInternal = true
            });
            await _notificationHelper.NotifyRole("CentralAuditor", "موافقة قيادية (المدير)", $"قام مدير الشركات بالموافقة على طلب {request.CompanyName}", "success", id);
        }

        await _context.SaveChangesAsync();
        
        var fullRequest = await GetFullRequest(id);
        if (fullRequest != null) await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest));

        return Ok(MapToDto(request));
    }

    /// <summary>
    /// قرار مساعد الوزير (موافقة أو رفض)
    /// </summary>
    [HttpPost("{id}/minister-decision")]
    [Authorize(Roles = "MinisterAssistant,Admin")]
    public async Task<ActionResult<RequestDto>> MinisterDecision(int id, [FromBody] MinisterDecisionDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return NotFound();

        int userId = GetUserId();
        
        if (dto.IsApproved)
        {
            request.StatusId = (int)RequestStatusEnum.TemporarilyReserved; // "مقبول - حجز مؤقت"
            request.History.Add(new RequestAction
            {
                UserId = userId,
                Role = "MinisterAssistant",
                ActionType = "MinisterAccepted",
                Note = dto.Note,
                IsInternal = true
            });
            await _notificationHelper.NotifyRole("CentralAuditor", "اعتماد نهائي (المعاون)", $"تم اعتماد طلب شركة {request.CompanyName} من قبل معاون الوزير", "success", id);
            await _notificationHelper.NotifyRole("ProvinceAdmin", "تحديث حالة الطلب", $"تمت الموافقة من الوزارة على طلب {request.CompanyName}", "success", id);
        }
        else
        {
            request.StatusId = (int)RequestStatusEnum.LeadershipResponded; // "تم الرد من القيادة"
            request.History.Add(new RequestAction
            {
                UserId = userId,
                Role = "MinisterAssistant",
                ActionType = "MinisterReturned",
                Note = dto.Note,
                IsInternal = true
            });
            await _notificationHelper.NotifyRole("CentralAuditor", "رفض/إرجاع قيادي", $"تم رفض أو إرجاع طلب شركة {request.CompanyName} من قبل معاون الوزير", "error", id);
        }

        await _context.SaveChangesAsync();
        
        var fullRequest = await GetFullRequest(id);
        if (fullRequest != null) await _notificationHelper.BroadcastRequestUpdated(MapToDto(fullRequest));

        return Ok(MapToDto(request));
    }

    /// <summary>
    /// إصدار رقم السجل النهائي (للمقبولين)
    /// </summary>
    [HttpPost("{id}/finalize-registry")]
    [Authorize]
    public async Task<ActionResult<RequestDto>> FinalizeRegistry(int id, FinalizeRegistryDto dto)
    {
        var request = await GetFullRequest(id);
        if (request == null) return NotFound();

        int userId = GetUserId();
        
        request.RegistryNumber = dto.RegistryNumber;
        request.RegistryDate = dto.RegistryDate;
        request.StatusId = (int)RequestStatusEnum.Finalized; // "حجز قطعي" (Finalized)
        
        request.History.Add(new RequestAction
        {
            UserId = userId,
            Role = "RegistryOfficer",
            ActionType = "Finalized",
            Note = $"تم إصدار السجل رقم: {dto.RegistryNumber} بتاريخ {dto.RegistryDate:yyyy-MM-dd}"
        });

        await _context.SaveChangesAsync();
        return Ok(MapToDto(request));
    }

    /// <summary>
    /// تحرير الاسم المحجوز بعد انتهاء المهلة / الرفض المبدئي
    /// </summary>
    [HttpPost("{id}/release-name")]
    [Authorize]
    public async Task<ActionResult<RequestDto>> ReleaseName(int id, [FromBody] string? note)
    {
        var request = await GetFullRequest(id);
        if (request == null) return NotFound();

        int userId = GetUserId();
        
        request.StatusId = (int)RequestStatusEnum.CancelledByStriking; // "حجز ملغى - شطب" (Released)
        
        request.History.Add(new RequestAction
        {
            UserId = userId,
            Role = "RegistryOfficer",
            ActionType = "Released",
            Note = note ?? "تم شطب الحجز وتحرير الاسم"
        });

        await _context.SaveChangesAsync();
        return Ok(MapToDto(request));
    }
}
