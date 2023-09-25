import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore, translationsRef } from "./firebaseConfig";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "twrnc";
import Option from "./components/Option";
import Button from "./components/Button";
import Tooltip from "./components/Tooltip";

type Exercise = {
  englishSentence: string;
  targetSentence: string;
  wordChoices: string[];
  correctWord: string;
  wordToGuess: string;
};

type Translation = {
  word: string;
  en: string;
  de: string;
};

interface CurrentExercise extends Exercise {
  id: string;
  translations: Record<string, string>;
}

export default function App() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] =
    useState<CurrentExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tappedTranslation, setTappedTranslation] = useState<string | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedWordChoice, setSelectedWordChoice] = useState<string | null>(
    null
  );
  const [showNextExercise, setShowNextExercise] = useState(false);
  const [isOptionCorrect, setIsOptionCorrect] = useState<null | boolean>(null);
  const [noMoreExercises, setNoMoreExercises] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      setIsLoading(true);
      try {
        const exerciseRef = doc(
          firestore,
          "exercises",
          currentExerciseIndex.toString()
        );
        const exerciseDoc = await getDoc(exerciseRef);

        if (exerciseDoc.exists()) {
          const exerciseData: Exercise = exerciseDoc.data() as Exercise;

          const targetSentenceWords = exerciseData.targetSentence
            .toLowerCase()
            .split(" ")
            .filter((word: string) => word !== "_");
          const translationsQuery = query(
            translationsRef,
            where("word", "in", targetSentenceWords)
          );

          const translationsSnapshot = await getDocs(translationsQuery);
          const translationsData: Record<string, string> = {};

          translationsSnapshot.forEach((doc) => {
            const translationData = doc.data() as Translation;
            translationsData[translationData.word] = translationData.en;
          });

          setCurrentExercise({
            ...exerciseData,
            id: exerciseDoc.id,
            translations: translationsData,
          });
          setSelectedWordChoice(null);
          setIsOptionCorrect(null);
          setShowNextExercise(false);
          setTappedTranslation(null);
        } else {
          console.log("Exercise not found.");
          setNoMoreExercises(true);
        }
      } catch (error) {
        console.error("Error fetching exercise: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [currentExerciseIndex]);

  const formatEnglishSentence = (
    englishSentence: string,
    wordToGuess: string
  ) => {
    const words = englishSentence.split(" ");

    const formattedSentence = words.map((word, index) =>
      word === wordToGuess ? (
        <Text
          key={index}
          style={[
            tw`font-bold`,
            {
              textDecorationLine: "underline",
            },
          ]}
        >
          {word}{" "}
        </Text>
      ) : (
        <Text key={index}>{word} </Text>
      )
    );

    return formattedSentence;
  };

  const formatGermanSentence = (
    targetSentence: string,
    correctWord: string
  ) => {
    const words = targetSentence.split(" ");

    const formattedSentence = words.map((word, index) => {
      if (word === "_") {
        return selectedWordChoice ? (
          <Option
            word={selectedWordChoice}
            selected={false}
            onPress={() => !showNextExercise && setSelectedWordChoice(null)}
            style={tw`mx-2`}
            key={index}
          />
        ) : (
          <Text key={index} style={tw`text-white text-3xl mt-5`}>
            {"_".repeat(correctWord.length)}{" "}
          </Text>
        );
      } else {
        return (
          <Text
            key={index}
            onPress={(event) => handleTappedWord(word, event)}
            style={[
              tw`text-white text-3xl mt-5`,
              {
                textDecorationStyle: "dotted",
                textDecorationLine: "underline",
              },
            ]}
          >
            {word}{" "}
          </Text>
        );
      }
    });

    return formattedSentence;
  };

  const onCheckAnswerPress = () => {
    if (!selectedWordChoice || !currentExercise) return;
    setShowNextExercise(true);

    if (selectedWordChoice) {
      const isSelectedWordCorrect =
        selectedWordChoice === currentExercise.correctWord;
      setIsOptionCorrect(isSelectedWordCorrect);
    }
  };

  const onContinuePress = () => {
    if (!selectedWordChoice) return;
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  const onResetPress = () => {
    setCurrentExerciseIndex(0);
    setNoMoreExercises(false);
  };

  const handleTappedWord = (word: string, event: any) => {
    const translation =
      currentExercise?.translations[word.toLowerCase()] || null;
    setTappedTranslation(translation);
    setTooltipPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
  };

  const clearTappedWord = () => {
    setTappedTranslation(null);
  };

  const handleWordSelection = (selected: string) => {
    setSelectedWordChoice(selected);
    clearTappedWord();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-[#3b6c81] justify-center items-center`}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (noMoreExercises) {
    return (
      <SafeAreaView style={tw`flex-1 bg-[#3b6c81] justify-center items-center`}>
        <Text style={tw`text-white text-3xl`}>No more exercises</Text>
        <Button onPress={onResetPress} style={tw`w-full`}>
          Reset
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={clearTappedWord}>
      <SafeAreaView
        style={tw`flex-1 bg-[#3b6c81] justify-around items-center w-full`}
      >
        <View style={tw`flex-1 justify-center items-center w-full`}>
          <Text style={tw`text-gray-100`}>Fill in the missing word</Text>
          {currentExercise ? (
            <>
              <Text style={tw`text-white text-3xl mt-5`}>
                {formatEnglishSentence(
                  currentExercise.englishSentence,
                  currentExercise.wordToGuess
                )}
              </Text>
              <View style={tw`flex-row`}>
                {formatGermanSentence(
                  currentExercise.targetSentence,
                  currentExercise.correctWord
                )}
              </View>
              {tappedTranslation && (
                <Tooltip text={tappedTranslation} position={tooltipPosition} />
              )}
              <View
                style={tw`gap-2 flex-row flex-wrap mt-15 justify-center w-1/2`}
              >
                {currentExercise.wordChoices.map((option, index: number) => (
                  <Option
                    key={option}
                    word={option}
                    selected={option === selectedWordChoice}
                    onPress={() => handleWordSelection(option)}
                    isDisabled={showNextExercise}
                  />
                ))}
              </View>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View style={tw`mb-10 w-full`}>
          {selectedWordChoice && !showNextExercise ? (
            <Button
              onPress={onCheckAnswerPress}
              isDisabled={selectedWordChoice !== null}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              onPress={onContinuePress}
              isDisabled={selectedWordChoice !== null}
              isCorrect={isOptionCorrect !== null ? isOptionCorrect : undefined}
            >
              Continue
            </Button>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
