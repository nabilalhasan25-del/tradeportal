namespace TradePortal.Api.Dtos;

public class SettingUpdateDto
{
    public required string Value { get; set; }
}

public class SettingResponseDto
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public required string Value { get; set; }
    public string? Description { get; set; }
    public string? Group { get; set; }
}
