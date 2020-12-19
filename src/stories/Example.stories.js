import React from "react";
import { boolean, text } from "@storybook/addon-knobs";

import Example from "../components/Example";
import "../styles/common.scss";

export default {
	title: "Example",
	component: Example,
};

const makeData = () => ({
	visible: boolean(
		"visible",
		true,
	),
	title: text(
		"title",
		() => {},
	),
});

export const ExampleStory = () => (
	<Example {...makeData()}/>
);
