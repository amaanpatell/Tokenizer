import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trainingPath = path.join(__dirname, "training.txt");
const vocabPath = path.join(__dirname, "vocab.json");

class Tokenizer {
  constructor() {
    this.wordToNumber = {};
    this.numberToWord = {};
    this.usedIds = new Set();
  }

  // Generate a random unused 3-digit number
  getRandomId() {
    let id;
    do {
      id = Math.floor(Math.random() * 900) + 100; // range 100–999
    } while (this.usedIds.has(id));
    this.usedIds.add(id);
    return id;
  }

  learnFrom(text) {
    const words = text.trim().split(/\s+/);
    for (const word of words) {
      if (this.wordToNumber[word] === undefined) {
        const id = this.getRandomId();
        this.wordToNumber[word] = id;
        this.numberToWord[id] = word;
      }
    }
  }

  encode(text) {
    const words = text.trim().split(/\s+/);
    const newWords = [];

    const res = words.map((word) => {
      if (this.wordToNumber[word] === undefined) {
        const id = this.getRandomId();
        this.wordToNumber[word] = id;
        this.numberToWord[id] = word;
        newWords.push(word);
        return id;
      } else {
        console.log(
          `Found in dictionary: "${word}" : ${this.wordToNumber[word]}`
        );
        return this.wordToNumber[word];
      }
    });

    if (newWords.length > 0) {
      fs.appendFileSync(trainingPath, " " + newWords.join(" "));
      this.saveDictionary();
      console.log("New words learned:", newWords.join(", "));
    }

    console.log("Encoded IDs:", res);
    return res;
  }

  decode(idString) {
      const ids = idString.split(/\s+/).map(Number);
      const words =ids.map((id) => this.numberToWord[id] ?? "<UNK>").join(" ");
      return words
  }

  saveDictionary() {
    fs.writeFileSync(vocabPath, JSON.stringify(this.wordToNumber, null, 2));
  }

  loadDictionary() {
    if (fs.existsSync(vocabPath)) {
      const data = JSON.parse(fs.readFileSync(vocabPath, "utf-8"));
      this.wordToNumber = data;
      this.numberToWord = Object.fromEntries(
        Object.entries(data).map(([word, id]) => [id, word])
      );
      this.usedIds = new Set(Object.values(this.wordToNumber));
    }
  }
}

// Initialize tokenizer
const tokenizer = new Tokenizer();
tokenizer.loadDictionary();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Tokenizer CLI!");
console.log("Type 'exit' anytime to quit.\n");

function mainMenu() {
  rl.question("Do you want to (1) Encode or (2) Decode? ", choice => {
    if (choice.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    if (choice === "1" || choice.toLowerCase() === "encode") {
      rl.question("Enter text to encode: ", text => {
        if (text.toLowerCase() === "exit") return mainMenu();
        const ids = tokenizer.encode(text);
        console.log("Encoded IDs:", ids.join(" "));
        console.log("Decoded back:", tokenizer.decode(ids));
        console.log("");
        mainMenu();
      });

    } else if (choice === "2" || choice.toLowerCase() === "decode") {
      rl.question("Enter IDs to decode (space-separated): ", ids => {
        if (ids.toLowerCase() === "exit") return mainMenu();
        console.log("Decoded text:", tokenizer.decode(ids));
        console.log("");
        mainMenu();
      });

    } else {
      console.log("Invalid choice. Please type 1 for Encode or 2 for Decode.");
      mainMenu();
    }
  });
}

mainMenu();
