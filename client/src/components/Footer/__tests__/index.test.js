import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from '../Footer';

afterEach(cleanup);

describe('Footer component', () => {

    it('renders', () => {
        render(<Footer />);
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Footer />);

        expect(asFragment()).toMatchSnapshot();
    });
})