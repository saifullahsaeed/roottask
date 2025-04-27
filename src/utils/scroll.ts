/**
 * Smoothly scrolls to an element with the given ID
 * @param elementId - The ID of the element to scroll to
 * @param options - Optional scroll options
 * @param options.behavior - The scroll behavior (default: 'smooth')
 * @param options.block - The vertical alignment (default: 'start')
 * @param options.inline - The horizontal alignment (default: 'nearest')
 */
export function scrollToElement(
  elementId: string,
  options: ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  }
) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView(options);
  }
}
