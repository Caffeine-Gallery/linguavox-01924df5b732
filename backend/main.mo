import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  type Translation = {
    original: Text;
    translated: Text;
    language: Text;
  };

  stable var translations : [Translation] = [];

  public func addTranslation(original: Text, translated: Text, language: Text) : async () {
    let newTranslation : Translation = {
      original = original;
      translated = translated;
      language = language;
    };
    translations := Array.append(translations, [newTranslation]);
  };

  public query func getTranslations() : async [Translation] {
    return translations;
  };

  public func clearTranslations() : async () {
    translations := [];
  };
}
