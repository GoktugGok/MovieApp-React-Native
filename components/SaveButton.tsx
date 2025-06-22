import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SaveButtonProps {
  onToggle?: (val: boolean) => void;
  saved?: boolean;
}

const SaveButton = ({ onToggle, saved = false }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const toggleSaved = () => {
    const newVal = !isSaved;
    setIsSaved(newVal);
    if (onToggle) onToggle(newVal);
  };

  return (
    <TouchableOpacity onPress={toggleSaved} className="p-2">
      <Icon
        name={isSaved ? 'favorite' : 'favorite-border'}
        size={30}
        color={isSaved ? '#A020F0' : '#fff'}
      />
    </TouchableOpacity>
  );
};

export default SaveButton;
