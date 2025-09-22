import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
    it('renders correctly', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={onPress} />
        );
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={onPress} />
        );
        fireEvent.press(getByText('Test Button'));
        expect(onPress).toHaveBeenCalled();
    });
});