import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from './Card';

describe('Card', () => {
    it('renders correctly with title', () => {
        const { getByText } = render(
            <Card title="Test Card">
                <Text>Card Content</Text>
            </Card>
        );
        expect(getByText('Test Card')).toBeTruthy();
        expect(getByText('Card Content')).toBeTruthy();
    });

    it('renders correctly without title', () => {
        const { getByText } = render(
            <Card>
                <Text>Card Content</Text>
            </Card>
        );
        expect(getByText('Card Content')).toBeTruthy();
    });
});