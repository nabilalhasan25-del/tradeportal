namespace TradePortal.Api.Dtos;

public class NameValidationRequestDto
{
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public int CompanyTypeId { get; set; }
}

public class NameValidationResultDto
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
    public string GoldenAdvice { get; set; } = string.Empty;
    public List<SimilarNameDto> SimilarExistingNames { get; set; } = new();
}

public class SimilarNameDto
{
    public int RequestId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double SimilarityScore { get; set; }
}
