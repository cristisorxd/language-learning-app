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
  id: string;
  correctOptionIndex: number;
  deWords: string[];
  enWords: string[];
  options: { word: string; selected: boolean }[];
  enTranslations: Translation[][];
};

type Translation = {
  en: string;
  de: string;
};

export default function App() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [showNextExercise, setShowNextExercise] = useState(false);
  const [isOptionCorrect, setIsOptionCorrect] = useState<null | boolean>(null);
  const [noMoreExercises, setNoMoreExercises] = useState(false);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchExercise(exerciseIndex);
  }, [exerciseIndex]);

  const fetchExercise = async (index: number) => {
    try {
      setLoadingExercise(true);
      const exerciseRef = doc(firestore, "exercises", index.toString());
      const exerciseDoc = await getDoc(exerciseRef);

      if (exerciseDoc.exists()) {
        const exerciseData = exerciseDoc.data();

        const translations = await Promise.all(
          exerciseData.deWords.map(async (word: string) => {
            if (!word) return "";
            const q = query(translationsRef, where("de", "==", word));
            const snapshot = await getDocs(q);
            const translationData = snapshot.docs.map((doc) => doc.data());
            return translationData;
          })
        );

        const initialOptions = exerciseData.options.map((option: string) => ({
          word: option,
          selected: false,
        }));

        const exerciseWithTranslations: Exercise = {
          id: exerciseDoc.id,
          correctOptionIndex: exerciseData.correctOptionIndex,
          deWords: exerciseData.deWords,
          enWords: exerciseData.enWords,
          options: initialOptions,
          enTranslations: translations,
        };

        setCurrentExercise(exerciseWithTranslations);
        setIsOptionSelected(false);
        setIsOptionCorrect(null);
        setShowNextExercise(false);
        setTooltipVisible(false);
      } else {
        console.log("Exercise not found.");
        setNoMoreExercises(true);
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
    } finally {
      setLoadingExercise(false);
    }
  };
  const handleOptionClick = (optionIndex: number) => {
    if (!currentExercise) return;

    const updatedOptions = [...currentExercise.options];
    const selectedOption = updatedOptions[optionIndex];
    const updatedDeWords = [...currentExercise.deWords];

    const currentSelectedOptionIndex = updatedOptions.findIndex(
      (option) => option.selected
    );

    if (selectedOption.selected) {
      const deselectedWordIndex = updatedDeWords.indexOf(selectedOption.word);
      updatedDeWords[deselectedWordIndex] = "";
      selectedOption.selected = false;
    } else if (currentSelectedOptionIndex === -1) {
      const emptyWordIndex = updatedDeWords.indexOf("");
      updatedDeWords[emptyWordIndex] = selectedOption.word;
      selectedOption.selected = true;
    } else {
      const currentSelectedOption = updatedOptions[currentSelectedOptionIndex];
      const deselectedWordIndex = updatedDeWords.indexOf(
        currentSelectedOption.word
      );
      updatedDeWords[deselectedWordIndex] = selectedOption.word;
      selectedOption.selected = true;
      currentSelectedOption.selected = false;
    }

    const updatedExercise = {
      ...currentExercise,
      deWords: updatedDeWords,
      options: updatedOptions,
    };

    setCurrentExercise(updatedExercise);
    setIsOptionSelected(true);
  };

  const handleGermanWordClick = (index: number, event: any) => {
    if (currentExercise && currentExercise.deWords[index] !== "") {
      const translations = currentExercise.enTranslations[index];
      const translationText = translations
        .map((translation) => translation.en)
        .join(", ");
      setTooltipText(translationText);
      setTooltipPosition({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      });
      setTooltipVisible(true);
    }
  };

  const canCheckAnswer = currentExercise?.deWords.includes("") ? false : true;

  const onCheckAnswerPress = () => {
    if (!canCheckAnswer || !currentExercise) return;

    setShowNextExercise(true);
    const selectedOption = currentExercise.options.find(
      (option) => option.selected
    );

    if (selectedOption) {
      const selectedOptionIndex =
        currentExercise.options.indexOf(selectedOption);
      const isCorrect =
        selectedOptionIndex === currentExercise.correctOptionIndex;

      setIsOptionCorrect(isCorrect);
    }
  };

  const onContinuePress = () => {
    if (!canCheckAnswer) return;
    setExerciseIndex(exerciseIndex + 1);
  };

  const onResetPress = () => {
    setExerciseIndex(0);
    setNoMoreExercises(false);
  };

  if (loadingExercise) {
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
    <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
      <SafeAreaView
        style={tw`flex-1 bg-[#3b6c81] justify-around items-center w-full`}
      >
        <View style={tw`flex-1 justify-center items-center w-full`}>
          <Text style={tw`text-gray-100`}>Fill in the missing word</Text>
          {currentExercise ? (
            <>
              <Text style={tw`text-white text-3xl mt-5`}>
                {currentExercise.enWords.join(" ")}
              </Text>
              <Text style={tw`text-white text-3xl mt-10`}>
                {currentExercise.deWords.map((word: string, index: number) => {
                  if (word === "") {
                    return <Text key={index}> ___ </Text>;
                  }
                  return (
                    <Text
                      key={index}
                      style={[
                        tw`text-white text-3xl mx-1`,
                        {
                          textDecorationStyle: "dotted",
                          textDecorationLine: "underline",
                        },
                      ]}
                      onPress={(event) => handleGermanWordClick(index, event)}
                    >
                      {word}{" "}
                    </Text>
                  );
                })}
              </Text>
              {tooltipVisible && (
                <Tooltip text={tooltipText} position={tooltipPosition} />
              )}
              <View
                style={tw`gap-2 flex-row flex-wrap mt-15 justify-center w-1/2`}
              >
                {currentExercise.options.map((option, index: number) => (
                  <Option
                    key={option.word}
                    word={option.word}
                    selected={option.selected}
                    onPress={() => handleOptionClick(index)}
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
          {isOptionSelected && !showNextExercise ? (
            <Button onPress={onCheckAnswerPress} isDisabled={canCheckAnswer}>
              Check Answer
            </Button>
          ) : (
            <Button
              onPress={onContinuePress}
              isDisabled={canCheckAnswer}
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
