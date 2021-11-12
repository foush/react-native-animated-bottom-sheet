# react-native-animated-bottom-sheet

Animated bottom sheet library for react native

## Installation

```sh
yarn add react-native-animated-bottom-sheet

OR

npm install react-native-animated-bottom-sheet
```

## Usage

```tsx
import { ModalBottomSheet } from "react-native-animated-bottom-sheet";

// ...

const [isVisible, setIsVisible] = useState(false);
<Button
  onPress={() => {
    console.log('current visibility: ', isVisible);
    setIsVisible(v => !v);
  }}
  title="Toggle"
/>
<ModalBottomSheet
  isVisible={isVisible}
  onHideComplete={() => {
    setIsVisible(false);
  }}>
  <Text>Hello World!</Text>
</ModalBottomSheet>
```

## License

MIT
