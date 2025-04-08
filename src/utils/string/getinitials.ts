/**
 * Get the initials of a name.
 * - If the name is one word, it will take the first two letters.
 * - If the name is two words, it will take the first letter of each word.
 * - If the name is three or more words, it will take the first letter of the first two words.
 * @param name - The name to get the initials of.
 * @returns The initials of the name.
 */
export function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  } else if (parts.length === 2) {
    return parts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  } else {
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }
}
