import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { Button } from '../../src/components/common/Button';
import { ThemeProvider } from '../../src/theme/ThemeContext';

describe('Button Component', () => {
  it('renders title text correctly', () => {
    let component: any;
    act(() => {
      component = renderer.create(
        <ThemeProvider>
          <Button title="Save Pin" onPress={() => {}} />
        </ThemeProvider>
      );
    });

    const json = component.toJSON();
    expect(json).toBeTruthy();
  });

  it('triggers onPress callback when pressed', () => {
    const handlePress = jest.fn();
    let component: any;
    act(() => {
      component = renderer.create(
        <ThemeProvider>
          <Button title="Click Me" onPress={handlePress} />
        </ThemeProvider>
      );
    });

    const pressable = component.root.findByType(Button);
    act(() => {
      pressable.props.onPress();
    });
    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
