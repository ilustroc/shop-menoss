import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import Login from "../../pages/Login";

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login", () => {
  // Verifica los campos principales
  test("debe mostrar el formulario de login", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();

    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  // Valida correo obligatorio
  test("debe mostrar error si el correo esta vacio", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

    expect(
      screen.getByText("Ingresa tu correo electrónico."),
    ).toBeInTheDocument();
  });

  // Valida formato del correo
  test("debe mostrar error si el correo es invalido", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "correo-invalido",
    );

    await user.type(screen.getByLabelText("Contraseña"), "Password123!");

    await user.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

    expect(
      screen.getByText("Ingresa un correo electrónico válido."),
    ).toBeInTheDocument();
  });

  // Valida contraseña obligatoria
  test("debe mostrar error si la contraseña esta vacia", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "usuario@test.com",
    );

    await user.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument();
  });

  // Verifica mostrar y ocultar contraseña
  test("debe permitir mostrar y ocultar la contraseña", async () => {
    const user = userEvent.setup();

    renderLogin();

    const password = screen.getByLabelText("Contraseña");

    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Ver" }));

    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Ocultar" }));

    expect(password).toHaveAttribute("type", "password");
  });
});
