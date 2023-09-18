# React Native Learning App

This is a React Native language learning app that helps users practice and improve their language skills by filling in missing words in sentences. It fetches exercises from a Firestore database and provides a user-friendly interface for language practice.

## Screenshots
![1](https://github.com/cristisorxd/language-learning-app/assets/86917574/4a6192f1-07bb-4b83-9915-87118c7f8cec)
![2](https://github.com/cristisorxd/language-learning-app/assets/86917574/c70ec56b-c93b-4936-8e79-4c266664e51d)
![3](https://github.com/cristisorxd/language-learning-app/assets/86917574/c9733d77-673b-4be7-9dab-e4cd4c42ae76)
![4](https://github.com/cristisorxd/language-learning-app/assets/86917574/ec87684d-5862-452e-bd37-e97a6771faf7)
![5](https://github.com/cristisorxd/language-learning-app/assets/86917574/52a3008e-5869-4992-b079-4b7ce152f345)
![6](https://github.com/cristisorxd/language-learning-app/assets/86917574/bf20e33d-3b03-468a-9b9d-c552878cddc7)

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
- Exercise Reset: Reset exercises to fetch new ones.

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
  - **Document:** Each document represents an exercise with the following fields:
    - `correctOptionIndex` (number): The index of the correct option within the `options` array.
    - `deWords` (array of strings): An array of German words used in the exercise.
    - `enWords` (array of strings): An array of English words used in the exercise.
    - `options` (array of strings): An array of strings which represents the options for the answer.
  - **Example Document:**
    ```json
    {
      "correctOptionIndex": 3,
      "deWords": ["Das", "", "ist", "klein"],
      "enWords": ["The", "house", "is", "small"],
      "options": ["folgen", "Schaf", "Beriden", "Hause"]
    }
    ```

### `translations` Collection

- **Collection:** `translations`
  - **Document:** Each document represents a translation pair with the following fields:
    - `de` (string): The German word or phrase.
    - `en` (string): The English translation of the German word or phrase.
  - **Example Document:**
    ```json
    {
      "de": "Haus",
      "en": "House"
    }
    ```
    
Please make sure that the `translations` collection contains the necessary translation pairs to support the exercises in the `exercises` collection.

 5. **Run the Application: Start the React Native development server.**:
```bash
npm start
