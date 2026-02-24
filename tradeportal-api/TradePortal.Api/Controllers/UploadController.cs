using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

namespace TradePortal.Api.Controllers;

[Route("api/[controller]")]
/// <summary>
/// رفع واسترجاع الملفات والوثائق المرفقة
/// </summary>
[ApiController]
[EnableCors("AllowFrontend")]
[Tags("إدارة المرفقات")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    /// <summary>
    /// رفع ملف عام
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "رفع الملفات (PDF)")] 
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("الرجاء اختيار ملف للتحميل");

        if (file.ContentType != "application/pdf")
            return BadRequest("يسمح فقط بملفات PDF لإضبارة الطلب");

        if (file.Length > 50 * 1024 * 1024) // 50MB
            return BadRequest("حجم الملف يتجاوز الحد المسموح (50 ميغابايت)");

        return await SaveFile(file);
    }

    /// <summary>
    /// رفع إيصال دفع
    /// </summary>
    [HttpPost("receipt")]
    [Authorize] // Simple auth for receipt upload
    public async Task<IActionResult> UploadReceipt(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("الرجاء اختيار ملف للتحميل");

        var allowedContentTypes = new[] { "application/pdf", "image/jpeg", "image/png" };
        if (!allowedContentTypes.Contains(file.ContentType))
            return BadRequest("يسمح فقط بملفات PDF أو الصور (JPG, PNG) للإيصال");

        if (file.Length > 10 * 1024 * 1024) // 10MB limit for receipts
            return BadRequest("حجم ملف الإيصال يتجاوز الحد المسموح (10 ميغابايت)");

        return await SaveFile(file);
    }

    private async Task<IActionResult> SaveFile(IFormFile file)
    {
        // Ensure directory exists
        var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return relative path for frontend usage
        return Ok(new { path = $"uploads/{fileName}" });
    }
}
