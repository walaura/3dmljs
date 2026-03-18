import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Image from './Image';

// More complex mock blob data to test with
const createMockBlob = (mimeType: string, size: number) => {
    const array = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    return new Blob([array], { type: mimeType });
};

export default {
    title: 'Components/Image',
    component: Image,
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
        maxWidth: { control: 'text' },
        maxHeight: { control: 'text' }
    }
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />;

export const StringUrl = Template.bind({});
StringUrl.args = {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    alt: 'A beautiful landscape'
};

export const BlobImage = Template.bind({});
BlobImage.args = {
    src: createMockBlob('image/png', 1024),
    alt: 'A blob image'
};

export const NoSource = Template.bind({});
NoSource.args = {
    src: undefined,
    alt: 'No source provided'
};

export const InvalidUrl = Template.bind({});
InvalidUrl.args = {
    src: 'https://this-url-does-not-exist.example.com/image.png',
    alt: 'An invalid URL'
};

export const EmptyString = Template.bind({});
EmptyString.args = {
    src: '',
    alt: 'Empty string source'
};

export const ErrorHandling = Template.bind({});
ErrorHandling.args = {
    src: 'https://httpbin.org/status/404', // Returns a 404 error
    alt: 'This will fail to load'
};