# Tokenizer CLI

A simple command-line tool to **encode** and **decode** text using a randomly assigned 3-digit vocabulary ID system.  
It stores learned words in a vocabulary file (`vocab.json`) and appends any new words to a training data file (`training.txt`).  
If a word is already in the dictionary, the program will notify you and reuse its existing ID.

---

## Features 

- Encode words into unique 3-digit IDs.
- Decode IDs back into words.
- Automatically remembers learned words between runs.
- Notifies when a word is found in the existing dictionary.
- CLI interface with menu for encoding/decoding.
- Continuous loop until user exits.

---

## Setup


### 1. Clone the repository
```bash
git clone https://github.com/amaanpatell/Tokenizer.git
cd Tokenizer
```

### 2. Install dependencies

 This project only uses Node.js built-in modules (fs, path, readline), so no extra installation is needed.Make sure you have Node.js 18+ installed.

### Usage
Run the program
```bash
node tokenizer.js
```
You will see:
```bash
Tokenizer CLI!
Type 'exit' anytime to quit.

Do you want to (1) Encode or (2) Decode?
```

### Example

Encoding:

```bash
Do you want to (1) Encode or (2) Decode? 1

Enter text to encode: hello world

New words learned: hello, world

Encoded IDs: 245 876

Decoded back: hello world
```

If you run it again:

```bash
Do you want to (1) Encode or (2) Decode? 1

Enter text to encode: hello world

Found in dictionary: "hello" : 245

Found in dictionary: "world" : 876

Encoded IDs: 245 876

Decoded back: hello world
```

### Decoding:

```bash
Do you want to (1) Encode or (2) Decode? 2

Enter IDs to decode (space-separated): 245 876

Decoded text: hello world
```

### File Structure

```
.
├── tokenizer.js     # Main CLI program
├── vocab.json       # Stored vocabulary (auto-created)
├── training.txt     # Stores new words learned
└── README.md        # Documentation
```

### Notes

- Type exit anytime to return to the main menu or quit the program.

- IDs are randomly assigned between 100–999 and never reused.

- vocab.json and training.txt are created automatically when you encode words.

