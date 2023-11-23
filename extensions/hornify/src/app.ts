import pornTags from "./assets/porn-tags.json";

class Hornify {
  protected static bodyObserver = new MutationObserver(Hornify.handleBodyMutation);

  protected static isEnabled: boolean;

  private static getRandomNumber(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static rollDice(diceSidesCount: number, targetPoints = diceSidesCount): boolean {
    const actualPoints = Hornify.getRandomNumber(diceSidesCount, 1);
    return targetPoints === actualPoints;
  }

  private static cleanString(inputString: string): string {
    const specialChars = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "-",
      "_",
      "+",
      "=",
      "[",
      "]",
      "{",
      "}",
      ";",
      ":",
      "<",
      ">",
      ".",
      ",",
      "/",
      "?",
      "№",
      "•",
      "★",
      "♪",
      "\u00A0", // nbsp
    ];
    const regexChars = new RegExp(`[${specialChars.join("\\")}]`, "g");
    const regexNumbers = /\d/g;
    return inputString.replace(regexChars, "").replace(regexNumbers, "");
  }

  private static hornifyString(inputString: string): string {
    let hornifiedString = inputString;
    const pornTagsMaxIndex = pornTags.length - 1;

    inputString.split(" ").forEach((subString) => {
      const cleanedSubString = Hornify.cleanString(subString);
      if (cleanedSubString !== "") {
        if (Hornify.rollDice(8)) {
          let randomPornTag = pornTags[Hornify.getRandomNumber(pornTagsMaxIndex)];
          const upperCased = cleanedSubString.toUpperCase();

          if (cleanedSubString === upperCased && cleanedSubString.length > 1) {
            randomPornTag = randomPornTag.toUpperCase();
          } else if (cleanedSubString[0] === upperCased[0]) {
            randomPornTag = randomPornTag[0].toUpperCase() + randomPornTag.slice(1);
          }

          hornifiedString = hornifiedString.replace(cleanedSubString, randomPornTag);
        }
      }
    });

    return hornifiedString;
  }

  private static processNode(inputNode: Node): void {
    const { parentElement } = inputNode;
    if (
      inputNode.nodeType === Node.TEXT_NODE &&
      !parentElement?.classList.contains("hornify-processed")
    ) {
      parentElement?.classList.add("hornify-processed");
      const { textContent } = inputNode;
      const text = textContent?.trim();
      if (textContent != null && text != null && text !== "") {
        // eslint-disable-next-line no-param-reassign
        inputNode.textContent = textContent.replace(text, Hornify.hornifyString(text));
      }
    }
  }

  private static processNodesRecursive(inputNode: Node): void {
    const { nodeName } = inputNode;
    if (nodeName !== "SCRIPT" && nodeName !== "STYLE" && nodeName !== "LINK") {
      Hornify.processNode(inputNode);
      inputNode.childNodes.forEach(Hornify.processNodesRecursive);
    }
  }

  private static handleBodyMutation(mutationList: MutationRecord[]): void {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach(Hornify.processNodesRecursive);
    });
  }

  public static enable(): void {
    Hornify.bodyObserver.observe(document.body, { childList: true, subtree: true });
    Hornify.isEnabled = true;
  }

  public static disable(): void {
    Hornify.bodyObserver.disconnect();
    Hornify.isEnabled = false;
  }

  public static toggle(): void {
    if (Hornify.isEnabled) {
      Hornify.disable();
    } else {
      Hornify.enable();
    }
  }
}

export default Hornify;
