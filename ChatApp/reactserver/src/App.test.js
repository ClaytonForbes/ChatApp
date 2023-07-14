import { render, fireEvent, screen, within } from "@testing-library/react";
import App from "./App";
// Material UI example 2 test
test("test AutoComplete selection", () => {
 render(<App />);
 const autocomplete = screen.getByTestId("autocomplete");
 const input = within(autocomplete).getByLabelText("available words");
 fireEvent.click(input); // sets focus
 fireEvent.change(input, { target: { value: "Here" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "is" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "a" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "sentence" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "about" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "nothing" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "by" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "Suleyman" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 fireEvent.change(input, { target: { value: "Jama" } });
 fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
 fireEvent.keyDown(autocomplete, { key: "Enter" });
 expect(screen.getByText("Here is a sentence about nothing by Suleyman Jama")).toBeInTheDocument();
 // this just shows what the test sees, comment it out if there are no problems
 // screen.debug();
});
