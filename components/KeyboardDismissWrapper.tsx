import { TouchableWithoutFeedback, Keyboard, View } from 'react-native'
import React from 'react'

const KeyboardDismissWrapper = ({ children }: {children: React.ReactNode}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
            className='flex-1'
        >
            {children}
        </View>
    </TouchableWithoutFeedback>
  )
}

export default KeyboardDismissWrapper