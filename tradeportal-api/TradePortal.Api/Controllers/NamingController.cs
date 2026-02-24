using Microsoft.AspNetCore.Mvc;
using TradePortal.Api.Helpers;
using TradePortal.Api.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace TradePortal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires login
public class NamingController : ControllerBase
{
    private readonly NameValidationService _validationService;

    public NamingController(NameValidationService validationService)
    {
        _validationService = validationService;
    }

    /// <summary>
    /// التحقق من اسم الشركة المقترح بناءً على التعاميم والقواعد القانونية والذكاء الاصطناعي
    /// </summary>
    [HttpPost("validate")]
    public async Task<ActionResult<NameValidationResultDto>> ValidateName([FromBody] NameValidationRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.NameAr))
        {
            return BadRequest("يجب إدخال الاسم باللغة العربية على الأقل.");
        }

        var result = await _validationService.ValidateNameAsync(request.NameAr, request.NameEn, request.CompanyTypeId);
        return Ok(result);
    }
}
