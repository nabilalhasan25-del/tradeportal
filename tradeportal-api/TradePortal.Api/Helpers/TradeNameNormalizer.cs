using System.Text.RegularExpressions;

namespace TradePortal.Api.Helpers;

public static class TradeNameNormalizer
{
    public static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        var current = input.Trim().ToLower();

        // 1. Normalize Arabic Characters (The part the user liked)
        // Aleph variants (أ، إ، آ) -> ا
        current = Regex.Replace(current, "[أإآ]", "ا");
        // Teh Marbuta (ة) -> ه
        current = current.Replace("ة", "ه");
        // YEH variants (ى) -> ي
        current = current.Replace("ى", "ي");

        // 2. Remove basic entity types "Company" and "Establishment" so they aren't counted
        // We handle variants and common prefixes (like "لـ" meaning "for")
        string[] entityWords = { 
            "شركة", "شركه", "لشركة", "لشركه",
            "مؤسسة", "مؤسسه", "موسسة", "موسسه", "لمؤسسة", "لمؤسسه", "لموسسة", "لموسسه" 
        };

        foreach (var word in entityWords)
        {
            // Use regex for word boundaries to avoid partial matches
            current = Regex.Replace(current, $@"\b{word}\b", "");
        }

        // 3. Remove non-word characters and extra spaces
        current = Regex.Replace(current, @"[^\w\s]", "");
        current = Regex.Replace(current, @"\s+", " ");

        return current.Trim();
    }
}
