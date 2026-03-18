import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sidebar from './Sidebar';

export default {
    title: 'Components/Sidebar',
    component: Sidebar,
    argTypes: {
        position: { control: 'radio', options: ['left', 'right'] },
    },
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (
        <>
            <details>
                <summary>Section 1</summary>
                <p>Content for section 1</p>
            </details>
            <details>
                <summary>Section 2</summary>
                <p>Content for section 2</p>
            </details>
        </>
    ),
    position: 'left',
};

export const RightPosition = Template.bind({});
RightPosition.args = {
    children: (
        <>
            <details>
                <summary>Section 1</summary>
                <p>Content for section 1</p>
            </details>
        </>
    ),
    position: 'right',
};