using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace TradePortal.Api.Controllers;

/// <summary>
/// استعراض الملفات
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableCors("AllowFrontend")]
[Tags("استعراض الملفات")]
public class FilesController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public FilesController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    /// <summary>
    /// معاينة وتنزيل الملفات المرفقة
    /// </summary>
    [HttpGet("view")]
    public IActionResult DownloadFile([FromQuery] string path)
    {
        if (string.IsNullOrEmpty(path))
            return BadRequest("Path is required");

        // Security check: Prevent directory traversal
        // The path should be relative to wwwroot, e.g., "uploads/filename.pdf"
        var sanitizedPath = path.Replace("..", "").Replace("\\", "/").TrimStart('/');
        var fullPath = Path.Combine(_environment.WebRootPath, sanitizedPath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound("File not found");

        var fileExtension = Path.GetExtension(fullPath).ToLower();
        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        if (!allowedExtensions.Contains(fileExtension))
            return BadRequest("نوع الملف غير مدعوم للمعاينة");

        var contentType = fileExtension switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            _ => "application/octet-stream"
        };

        var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
        return File(fileStream, contentType);
    }
}
