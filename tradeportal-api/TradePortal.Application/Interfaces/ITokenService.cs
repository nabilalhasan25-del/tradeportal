using TradePortal.Domain.Entities;

namespace TradePortal.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(User user, IList<string> roles);
}
