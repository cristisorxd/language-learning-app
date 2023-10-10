# React Native Learning App

This is a React Native language learning app that helps users practice and improve their language skills by filling in missing words in sentences. It fetches exercises from a Firestore database and provides a user-friendly interface for language practice.

## Screenshots
![WhatsApp Image 2023-10-10 at 09 10 15](https://github.com/cristisorxd/language-learning-app/assets/86917574/37f1b486-d996-481a-a800-5928d7bfabda)
![WhatsApp Image 2023-10-10 at 09 10 16](https://github.com/cristisorxd/language-learning-app/assets/86917574/811034fa-d15f-43e9-899b-e915f746ada5)
![WhatsApp Image 2023-10-10 at 09 10 16 (1)](https://github.com/cristisorxd/language-learning-app/assets/86917574/4df69f9b-cf1f-459c-a9f8-74cde14a656d)
![WhatsApp Image 2023-10-10 at 09 10 17](https://github.com/cristisorxd/language-learning-app/assets/86917574/6cc6ffe6-542c-4f45-ae28-48beb0dc45f9)
![WhatsApp Image 2023-10-10 at 09 10 18](https://github.com/cristisorxd/language-learning-app/assets/86917574/f9a59eb1-3374-478d-bc49-d51934f05113)
![WhatsApp Image 2023-10-10 at 09 10 18 (1)](https://github.com/cristisorxd/language-learning-app/assets/86917574/018d3d19-b748-4a4c-8f78-68b387a18733)

## Tech Stack

- React Native
- TypeScript
- Expo
- TWRNC for styling
- Firebase (Firestore)

### Features
- Exercise Display: Display exercises with missing words to guess in both English and German.
- Multiple-Choice Options: Provide multiple-choice options for users to select.
- Answer Validation: Check user answers and display correctness.
- Word Translations: Show translations of German words in English when tapped.
- Exercise Reset: Reset exercises when there are none left.

### Prerequisites

- Node.js and npm (Node Package Manager) installed
- Expo CLI (you can install it globally using `npm install -g expo-cli`)
- Firebase project set up with Firestore enabled

### Installation

1. **Clone this repository to your local machine**:

   ```bash
   git clone https://github.com/your-username/react-native-learning-app.git

2. **Install Dependencies: Navigate to the project folder and install the required dependencies.**:

   ```bash
   cd language-learning-app
   npm install
3. **Firebase Configuration:**:
- Set up a Firebase project and Firestore database.
- Modify the firebaseConfig.ts file and configure it with your Firebase credentials.
  ```bash
   const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
   };
4. **Database Schema:**:
- In this app, Firestore is used to store exercises and their translations. Below is an example of the database schema:

### `exercises` Collection

- **Collection:** `exercises`
  - **Document:** Each document represents an exercise (it should have a number as the id (0-9999) with the following fields:
    - `correctWord` (string): The missing word in the german sentence.
    - `targetSentence` (string): A German sentence that contains the character '_' as the missing one
    - `englishSentence` (string): An English sentence.
    - `wordChoices` (array of strings): An array of strings which represents the options for the answer.
    - `wordToGuess` (string): A string that represents the word in English that corresponds to the missing german word..
  - **Example Document:**
    ```json
    {
      "correctWord": "Hause",
      "englishSentence": "The house is small",
      "targetSentence": "Das _ ist klein",
      "wordChoices": ["folgen", "Schaf", "Beriden", "Hause"],
      "wordToGuess": "house",
    }
    ```

### `translations` Collection

- **Collection:** `translations`
  - **Document:** Each document represents a translation pair with the following fields:
    - `de` (string): The German word or phrase.
    - `en` (string): The English translation of the German word or phrase.
    - `word` (string): The target word referring to.
  - **Example Document:**
    ```json
    {
      "de": "das",
      "en": "the",
      "word": "das"
    }
    ```
    
Please make sure that the `translations` collection contains the necessary translation pairs to support the exercises in the `exercises` collection.

 5. **Run the Application: Start the React Native development server.**:
```bash
npm start
