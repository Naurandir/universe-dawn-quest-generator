export function scrollIntoView(elementId: string, expanded: boolean) {
  if (expanded == true) {
    return;
  }

  setTimeout(() => {
    document.getElementById(elementId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }, 100);
}
