import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount((value) => value + 1)}>
            回数：{count}
        </button>
    );
}

test("ボタンをクリックすると回数が増える", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const button = screen.getByRole("button", {
        name: "回数：0",
    });

    await user.click(button);

    expect(screen.getByRole("button", { name: "回数：1" })).toBeInTheDocument();
});
